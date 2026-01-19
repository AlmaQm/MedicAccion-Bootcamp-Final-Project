import { useRef, useState, useEffect } from "react";
import { createWorker } from "tesseract.js";
import ScanerImg from "../assets/scanner.png";
import { chatCerrado } from "../components/OpenAiApi";
import { cleanOcrText } from "../components/LimpiarTexto.jsx";
import api from "../api";
import { useNavigate, Link, useLocation } from "react-router-dom";
import '../App.css';
import '../styles/Tesseract.css'
import { MessageCircle, LogOut, House, CalendarDays, Camera, ChartNoAxesCombined, UserRound } from 'lucide-react';
import logo from "../assets/logo.svg";
import { toast } from "react-toastify";
import '../styles/Navbar.css';

export default function TesseractOCR() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const workerRef = useRef(null);

  const [workerReady, setWorkerReady] = useState(false);
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState("");
  const [autoScanOnce, setAutoScanOnce] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const [showResultModal, setShowResultModal] = useState(false);
  const [showResultChat, setShowResultChat] = useState(false);
  const [chatText, setChatText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [ocrResult, setOcrResult] = useState({
    original: "",
    limpio: "",
    normalizado: "",
    medicamento: "",
    dosis: null,
    via: null,
  });

  const navigate = useNavigate();
  /*Boton footer*/
  const location = useLocation();

  const [hidden, setHidden] = useState(false);
  const isActive = (path) => location.pathname === path;

  const handleCancelCalendario = async () => {
    setShowResultChat(false); // oculta modal de calendario
    setScanned(false);         // reinicia escaneo
    setResult("");             // limpia resultado OCR
    setOcrResult({
      original: "",
      limpio: "",
      normalizado: "",
      medicamento: "",
      dosis: null,
      via: null,
    }); 
    setCameraActive(true);       // Forzar que la cámara se considere activa
    await startCamera();  
  };


  // 🔥 Cada vez que cambia la ruta, reiniciamos todo
  useEffect(() => {
      setHidden(false);
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth", // puedes quitarlo si no quieres animación
      });
  }, [location.pathname]);
  
  // ============================================================
  // Inicializar worker
  // ============================================================
  useEffect(() => {
    const initWorker = async () => {
      const worker = await createWorker();
      workerRef.current = worker;
      setWorkerReady(true);
    };

    initWorker();
    return () => workerRef.current && workerRef.current.terminate();
  }, []);

  // ============================================================
  // Auto-scan
  // ============================================================
  useEffect(() => {
    if (autoScanOnce && workerReady && started) {
      captureAndScan();
      setAutoScanOnce(false);
    }
  }, [autoScanOnce, workerReady, started]);

  // ============================================================
  // Cámara
  // ============================================================
  const handleActivateCamera = async (mode = "environment") => {
    const ok = window.confirm(
      "Esta aplicación necesita acceder a tu cámara. ¿Deseas continuar?"
    );
    if (ok) {
      await startCamera(mode);
      setCameraActive(true);
      setStarted(true);
    }
  };

    const apagarCamara = () => {
    if (videoRef.current) {
      const video = videoRef.current;

      if (video.srcObject) {
        const stream = video.srcObject;
        // Detener todos los tracks
        stream.getTracks().forEach(track => track.stop());
        // Limpiar video con pequeño delay
        setTimeout(() => {
          video.srcObject = null;
          video.pause();
          // Resetear estados de cámara
          setStarted(false);
          setCameraActive(false);
          setShowResultModal(false);
        }, 50); // 50ms es suficiente en la mayoría de dispositivos
      } else {
        // Si no hay srcObject, solo resetear estados
        setStarted(false);
        setCameraActive(false);
        setShowResultModal(false);
      }
    }
  };

  const startCamera = async (mode = "environment") => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode }
      });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setStarted(true);
      setCameraActive(true);
    } catch (err) {
      alert("Error al activar la cámara");
      setCameraActive(false);
    }
  };

  // ============================================================
  // FUNCIONES AUXILIARES (cannyEdgeDetection, deskewCanvas)
  // ============================================================
  function cannyEdgeDetection(data, width, height) {
    const out = new Uint8ClampedArray(data.length);
    const gx = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const gy = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let sumX = 0, sumY = 0, idx = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const pixel = data[((y + ky) * width + (x + kx)) * 4];
            sumX += pixel * gx[idx];
            sumY += pixel * gy[idx];
            idx++;
          }
        }
        const mag = Math.sqrt(sumX * sumX + sumY * sumY);
        const i = (y * width + x) * 4;
        out[i] = out[i + 1] = out[i + 2] = mag > 60 ? 255 : 0;
      }
    }
    return out;
  }

  function deskewCanvas(canvas) {
    const ctx = canvas.getContext("2d");
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    let pts = [];
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const idx = (y * canvas.width + x) * 4;
        if (data[idx] === 0) pts.push({ x, y });
      }
    }

    if (pts.length < 10) return;

    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (const p of pts) {
      sumX += p.x;
      sumY += p.y;
      sumXY += p.x * p.y;
      sumX2 += p.x * p.x;
    }

    const n = pts.length;
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const angle = Math.atan(slope) * (180 / Math.PI);

    const temp = document.createElement("canvas");
    temp.width = canvas.width;
    temp.height = canvas.height;
    const tctx = temp.getContext("2d");
    tctx.translate(canvas.width / 2, canvas.height / 2);
    tctx.rotate((-angle * Math.PI) / 180);
    tctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(temp, 0, 0);
  }

  // ============================================================
  // OCR COMPLETO
  // ============================================================
  const captureAndScan = async () => {
    if (!workerReady) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    const w = canvas.width, h = canvas.height;

    // Grayscale
    for (let i = 0; i < data.length; i += 4) {
      const g = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      data[i] = data[i + 1] = data[i + 2] = g;
    }

    // Aumentar contraste, Canny y Deskew (igual que tu código anterior)
    const edges = cannyEdgeDetection(data, w, h);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i + 1] = data[i + 2] = edges[i];
    }
    ctx.putImageData(imageData, 0, 0);

    deskewCanvas(canvas);

    // OCR
    const { data: ocrData } = await workerRef.current.recognize(canvas);
    setResult(ocrData.text);
    setScanned(true);

    if (ocrData.text) {
      const cleanText = cleanOcrText(ocrData.text);
      setOcrResult(cleanText);
      setShowResultModal(true);
    }
  };

  // ============================================================
  // BUSCAR MEDICAMENTO (API)
  // ============================================================
  const buscarMecicamento = async () => {
    setIsLoading(true);
    setShowResultModal(false);
    setShowResultChat(true);

    const texto = `${ocrResult.medicamento} ${ocrResult.dosis ? ocrResult.dosis.join(', ') : ''} ${ocrResult.via ? ocrResult.via.join(', ') : ''}`;

    try {
      const laiaJSON = await chatCerrado(texto);
      setChatText(laiaJSON);
    } catch (error) {
      setChatText("Ocurrió un error al procesar la información.");
    }

    setIsLoading(false);
  };

  // ============================================================
  // GUARDAR MEDICAMENTO
  // ============================================================
  const guardarMedicamento = async () => {
    const medicamento = chatText.medicamento || "Desconocido";
    const descripcion = chatText.descripcion || "Sin descripción";
    localStorage.setItem("medicamentoActual", medicamento);

    try {
      await api.post("/api/medicamentos/", { medicamento, descripcion });

      apagarCamara();

      // Mostrar el toast antes de navegar
      toast.success("Medicamento registrado con éxito 🩺");

      // Navegar después de un pequeño delay opcional
      setTimeout(() => {
        navigate("/calendario");
      }, 500); // 0.5s para que el toast se vea antes de cambiar de página

    } catch (error) {
      toast.error(error.message || "Error al registrar el medicamento");
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <>
      <div className="waves"></div>
      <div className="main-app">
        <header className="main-header">
          <div className="header-components">
            <Link to="/Chatbot" state={{ from: location?.pathname }} className="header-icon-chat">
              <MessageCircle size={26} className="message-circle" />
            </Link>
            <Link to="/" className="header-logo-wrapper">
              <img src={logo} alt="Medicacción Logo" className="header-logo" />
            </Link>
            <Link to="/logout">
              <button className="header-icon-logout">
                <LogOut size={26} className="header-logout" />
              </button>
            </Link>
          </div>
        </header>

        {!showResultChat && (
          <>
            <div className="camera-ocr-video-container">
              <video ref={videoRef} className="camera-ocr-video" />
              {!started && (
                <div className="overlay-img">
                  <img src={ScanerImg} alt="scanner" className="scanner-image" />
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="camera-ocr-canvas" />
            {!scanned && (
            <div className="instrucciones">
              <h3 className="h3">Instrucciones para escanear su medicamento correctamente:</h3>
              <ol>
                <li>Activa la cámara y acepta los permisos para que la app pueda acceder a ella.</li>

                <li>Coloca el medicamento frente a la cámara, con buena luz y sin sombras.</li>

                <li>Enfoca la caja correctamente, asegurándote de que el nombre y el texto se vean nítidos.</li>
              </ol>
            </div>
            )}
            {!scanned && (
              <div className="modal-buttons">
                {!cameraActive ? (
                  <button onClick={() => handleActivateCamera("environment")} className="camera-ocr-button-activate">
                    Activar
                  </button>
                ) : (
                  <>
                    <button onClick={() => setAutoScanOnce(true)} className="camera-ocr-button">
                      Escanear
                    </button>
                    <button
                      onClick={() => apagarCamara()}
                      className="camera-ocr-button"
                    >
                      Desactivar
                    </button>

                  </>
                )}
              </div>
            )}
            {showResultModal && (
              <div className="camera-ocr-video-container-result">
                <div className="camera-ocr-result">
                  <p>Resultado:</p>
                  <p>{ocrResult.medicamento}</p>
                  <p>{ocrResult.dosis}</p>
                  <p>{ocrResult.via}</p>
                  <hr />
                  <p>¿Quieres buscar este medicamento?</p>
                  <div className="modal-buttons">
                    <button onClick={() => buscarMecicamento()} className="camera-ocr-button">
                      Aceptar
                    </button>
                    <button onClick={() => {
                      setShowResultModal(false)
                      setScanned(false);
                    }} 
                    className="camera-ocr-button">
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {showResultChat && (
          <div className="camera-ocr-video-container-informe">
            <div className="camera-ocr-result">
              {isLoading ? (
                <div className="camera-cargando">
                  <p>Cargando...</p>
                </div>
              ) : chatText ? (
                !chatText.error ? (
                  <div style={{ whiteSpace: "pre-line" }}>
                    <p><strong>Medicamento:</strong> {chatText.medicamento || "N/A"}</p>
                    <p><strong>Descripción:</strong> {chatText.descripcion || "N/A"}</p>
                    <p><strong>Uso:</strong></p>
                    {Array.isArray(chatText.uso) ? (
                      chatText.uso.map((item, index) => (
                        <p key={index}> - {item}</p>
                      ))
                    ) : (
                      <p>N/A</p>
                    )}

                    <p><strong>Dosis recomendada:</strong></p>
                    {chatText.dosis_recomendada && typeof chatText.dosis_recomendada === "object" ? (
                      Object.entries(chatText.dosis_recomendada).map(([key, value]) => (
                        <p key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}: {value}</p>
                      ))
                    ) : (
                      <p>N/A</p>
                    )}

                    <p><strong>Precauciones:</strong></p>
                    {Array.isArray(chatText.precauciones) ? (
                      chatText.precauciones.map((item, index) => (
                        <p key={index}> - {item}</p>
                      ))
                    ) : (
                      <p>N/A</p>
                    )}

                    <p><strong>Efectos secundarios:</strong></p>
                    {Array.isArray(chatText.efectos_secundarios) ? (
                      chatText.efectos_secundarios.map((item, index) => (
                        <p key={index}> - {item}</p>
                      ))
                    ) : (
                      <p>N/A</p>
                    )}

                    <hr />
                    <p>¿Quieres añadirlo a tu calendario?</p>
                    <div className="modal-buttons">
                      <button onClick={() => guardarMedicamento()} className="camera-ocr-button">Aceptar</button>
                      <button
                        onClick={handleCancelCalendario}
                        className="camera-ocr-button"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: 'red' }}>Error: {chatText.error}<br />{chatText.raw || ""}</p>
                )
              ) : null}
            </div>
          </div>
        )}

        {/* BOTÓN DE NAVEGACIÓN INFERIOR */}
          <div
              className={`sticky-button-container ${hidden ? "hide" : ""}`}
              >
              <button
                  className={`sticky-btn ${isActive("/") ? "active" : ""}`}
                  onClick={() => navigate("/")}
                  aria-label="Inicio"
              >
                  <House />
              </button>

              <button
                  className={`sticky-btn ${isActive("/calendario") ? "active" : ""}`}
                  onClick={() => navigate("/calendario")}
                  aria-label="Calendario"
              >
                  <CalendarDays />
              </button>

              <button
                  className={`sticky-btn camera-btn ${isActive("/tesseractOCR") ? "active" : ""}`}
                  onClick={() => navigate("/tesseractOCR")}
                  aria-label="Cámara"
              >
                  <Camera />
                  <span className="corner-bl"></span>
                  <span className="corner-br"></span>
              </button>

              <button
                  className={`sticky-btn ${isActive("/progresos") ? "active" : ""}`}
                  onClick={() => navigate("/progresos")}
                  aria-label="Progresos"
              >
                  <ChartNoAxesCombined />
              </button>

              <button
                  className={`sticky-btn ${isActive("/perfil") ? "active" : ""}`}
                  onClick={() => navigate("/perfil")}
                  aria-label="Perfil"
              >
                  <UserRound />
              </button>
         </div>

      </div>
    </>
  );
}
