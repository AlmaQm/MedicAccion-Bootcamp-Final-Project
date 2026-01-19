
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation} from "react-router-dom";
import '../App.css';
import { ArrowLeft, LogOut, House, CalendarDays, Camera, ChartNoAxesCombined, UserRound  } from 'lucide-react';
import logo from "../assets/logo.svg";
import '../styles/Chatbox.css';
import '../styles/Navbar.css';

export default function Chatbot() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  const [messages, setMessages] = useState([
    { from: "bot", text: "Hola 🖐️, cuéntame tus síntomas de hoy" }
  ]);
  const [userInput, setUserInput] = useState("");
  const chatBoxRef = useRef(null);

  /*Boton footer*/
  const [hidden, setHidden] = useState(false);
  const isActive = (path) => location.pathname === path;

  // 🔥 Cada vez que cambia la ruta, reiniciamos todo
  useEffect(() => {
      setHidden(false);
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth", // puedes quitarlo si no quieres animación
      });
  }, [location.pathname]);

  // ---------- Funciones de envío de mensajes ----------

  const handleSend = () => {
    if (!userInput.trim()) return;

    const newMessage = { from: "user", text: userInput };
    const botResponse = continuarChat(userInput);

    // Evitamos duplicar el mensaje
    setMessages((prev) => [...prev, newMessage, { from: "bot", text: botResponse }]);
    setUserInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // ---------- Scroll automático ----------
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // Base de datos simple de síntomas → alimentos recomendados
  const recomendaciones = {

    dolor_garganta: "Bebe té caliente con miel 🍯☕ (el calor suaviza la garganta y la miel recubre la mucosa para reducir irritación), come sopa 🍲 (hidrata y aporta nutrientes que facilitan la recuperación del tejido), mastica jengibre 🌿 (antiinflamatorio natural que disminuye inflamación y dolor), evita alimentos fríos 🥶 (el frío puede contraer vasos sanguíneos y aumentar dolor).",

    dolor_cabeza: "Bebe agua 💧 (previene deshidratación que reduce el flujo sanguíneo cerebral y puede causar dolor), consume frutos secos 🥜 (aportan magnesio que relaja vasos sanguíneos y músculos), come plátano 🍌 (alto en potasio para equilibrio electrolítico y función muscular), descansa evitando pantallas 📵 (reduce tensión ocular y fatiga visual).",

    fiebre: "Hidrátate con agua o suero 💧 (reemplaza líquidos y electrolitos perdidos), consume frutas como sandía 🍉 (aportan agua y vitaminas, ayudan a mantener hidratación), come comidas ligeras 🍽️ (facilitan digestión y evitan gasto energético excesivo).",

    diarrea: "Come arroz blanco 🍚 (absorbe líquidos y facilita formación de heces), plátano 🍌 (aporta potasio perdido), pollo hervido 🍗 (proteína fácil de digerir), evita lácteos 🥛🚫 (la lactosa puede empeorar diarrea).",

    estreñimiento: "Consume avena 🥣 (fibra soluble que ablanda heces), come kiwi 🥝 (fibra insoluble que estimula tránsito intestinal), bebe agua 💧 (hidrata y facilita función de fibra), incluye verduras verdes 🥬 (aportan fibra y nutrientes), evita harinas 🍞🚫 (ralentizan digestión).",

    acidez: "Come manzana 🍎 (absorbe exceso de ácido), ingiere avena 🥣 (forma capa protectora en estómago), consume yogurt natural 🥛 (equilibra flora intestinal), evita café ☕🚫 y fritos 🍟🚫 (aumentan ácido y retrasan vaciado gástrico).",

    resfriado: "Bebe té de limón con miel 🍯🍋 (calma la garganta y aporta vitamina C), come sopa de pollo 🍲🐔 (reduce congestión y aporta nutrientes), mastica jengibre 🌿 (antiinflamatorio natural), consume cítricos 🍊 (refuerzan defensas).",

    fatiga: "Consume avena 🥣 (proporciona energía sostenida), come huevos 🥚 (proteína de fácil absorción), frutos secos 🥜 (magnesio para función muscular), espinaca 🥬 (hierro para oxigenación), frutas cítricas 🍊 (vitamina C que combate fatiga).",

    ansiedad: "Come chocolate negro 🍫 (estimula serotonina y sensación de bienestar), bebe té de manzanilla 🍵 (efecto calmante), ingiere nueces 🌰 (grasas saludables que apoyan sistema nervioso), come plátano 🍌 (magnesio y triptófano que ayudan a relajación).",

    inflamacion: "Agrega cúrcuma 🌕 (curcumina reduce inflamación), consume jengibre 🌿 (antiinflamatorio), come frutas rojas 🍓 (antioxidantes que combaten radicales libres), pescado 🐟 (omega-3 que disminuye inflamación), usa aceite de oliva 🫒 (grasas saludables antiinflamatorias).",

    gripe: "Consume sopa de verduras 🍲🥕 (hidrata y aporta nutrientes), toma miel 🍯 (calma garganta y suaviza mucosa), bebe limón 🍋 (vitamina C que fortalece sistema inmune), descansa 😴 (favorece recuperación).",

    dolor_muscular: "Come plátano 🍌 (potasio que previene calambres), nueces 🥜 (magnesio que relaja músculos), pescado 🐟 (omega-3 que reduce inflamación), hidrátate 💧 (previene deshidratación muscular), estira 🤸 (disminuye rigidez).",

    nauseas: "Come galletas saladas 🍘 (suaves para estómago y estabilizan electrolitos), bebe té de jengibre 🌿🍵 (reduce náuseas mediante acción antiemética), ingiere arroz blanco 🍚 (digestion fácil), hidrátate 💧 (evita descompensación).",

    insomnio: "Bebe leche tibia 🥛 (triptofano ayuda a sintetizar melatonina), toma manzanilla 🍵 (sedante natural), come plátano 🍌 (magnesio que relaja músculos), evita café ☕🚫 (cafeína estimula sistema nervioso).",

    hipotension: "Bebe agua 💧 (aumenta volumen sanguíneo), agrega sal moderada 🧂 (ayuda a subir presión), consume frutos secos 🥜 (energía y minerales), come comidas frecuentes 🍽️ (evita bajadas bruscas de presión).",

    hipertension: "Consume frutas y verduras 🍎🥦 (potasio ayuda a regular presión arterial), avena 🥣 (reduce colesterol), pescado 🐟 (omega-3 protege corazón), reduce sal 🧂🚫 (evita retención de líquidos y sobrecarga vascular).",

    dolor_espalda: "Come plátano 🍌 (magnesio relaja músculos), almendras 🌰 (previenen calambres), incluye pescado 🐟 (omega-3 reduce inflamación), realiza estiramientos 🤸 (alivia tensión muscular).",

    mareos: "Bebe agua 💧 (mantiene presión y volumen sanguíneo), come galletas saladas 🍘 (aumenta sodio para presión), consume frutas 🍎 (glucosa para energía), descansa 😴 (evita caídas por mareo).",

    dolor_estomacal: "Come arroz blanco 🍚 (protege mucosa), zanahoria 🥕 (fibra soluble fácil de digerir), plátano 🍌 (regula tránsito), bebe manzanilla 🍵 (reduce espasmos).",

    resfriado_alergico: "Bebe agua 💧 (mantiene mucosas hidratadas), toma miel 🍯 (suaviza garganta), inhala vapor 🌫️ (despeja vías respiratorias), consume cítricos 🍊 (vitamina C refuerza defensas).",

    tos: "Bebe té con miel 🍯🍵 (alivia irritación y recubre mucosa), mastica jengibre 🌿 (reduce inflamación), evita lácteos 🥛🚫 (aumentan mucosidad), descansa 😴 (favorece recuperación).",

    deshidratacion: "Bebe agua 💧 (reposición principal de líquidos), consume frutas con agua 🍉 (aportan agua y electrolitos), come sopa ligera 🍲 (hidratación y nutrientes), evita alcohol 🍺🚫 (provoca deshidratación).",

    dolor_ojos: "Come zanahoria 🥕 (vitamina A mejora visión), espinaca 🥬 (antioxidantes que protegen retina), descansa los ojos 😌 (reduce fatiga), limita pantallas 📵 (evita sobrecarga visual).",

    ansiedad_digestiva: "Come plátano 🍌 y avena 🥣 (calman el sistema digestivo y aportan fibra), yogurt 🥛 (regula flora intestinal), bebe té de menta 🍃🍵 (relajante estomacal), mantente hidratado 💧 (favorece digestión).",

    dolor_articular: "Consume pescado 🐟 (omega-3 reduce inflamación), nueces 🥜 (grasas saludables), agrega cúrcuma 🌕 (antiinflamatoria), bebe agua 💧 (lubrica articulaciones), realiza movimientos suaves 🤸 (mantiene movilidad).",

    fatiga_visual: "Come frutas 🍎 (antioxidantes que protegen ojos), hidrátate 💧 (mantiene líquidos oculares), descansa la vista 😌 (reduce fatiga), realiza ejercicios de enfoque 👀 (mejora acomodación visual).",

    resfriado_fuerte: "Consume sopa de pollo 🍲🐔 (hidrata y aporta nutrientes), toma miel 🍯 (calma garganta), bebe limón 🍋 (vitamina C), inhala vapor 🌫️ (despeja vías respiratorias), descansa 😴 (favorece recuperación).",

    infeccion_urinaria: "Bebe agua 💧 (aumenta diuresis y elimina bacterias), consume arándanos 🍒 (antioxidantes y proantocianidinas que reducen adhesión bacteriana), yogurt natural 🥛 (flora intestinal saludable), evita azúcares 🍬🚫 (favorecen crecimiento bacteriano).",

    dolor_migraña: "Bebe agua 💧 (previene deshidratación que provoca migraña), toma té de jengibre 🌿🍵 (reduce inflamación y dolor), come almendras 🌰 (magnesio que relaja vasos sanguíneos), descansa 😴 (disminuye estímulos que generan dolor).",

    cansancio: "Consume frutas 🍎 (azúcares naturales para energía rápida), frutos secos 🥜 (magnesio y proteínas), come avena 🥣 (energía sostenida), mantente hidratado 💧 (previene fatiga por deshidratación).",

    falta_apetito: "Come frutas 🍎 y yogur 🥛 (ligeros y fáciles de digerir), ingiere sopas 🍲 (hidratan y aportan nutrientes), realiza pequeñas comidas 🍽️ (estimula apetito sin sobrecargar digestión).",

    acne: "Bebe agua 💧 (elimina toxinas y mantiene piel hidratada), consume frutas y verduras 🥦🍎 (vitaminas y antioxidantes que reducen inflamación), evita fritos 🍟🚫 y azúcares 🍬🚫 (disminuyen brotes), lava tu cara 🧼 (elimina exceso de sebo y bacterias).",

    irritacion_piel: "Come aguacate 🥑 (grasas saludables que mejoran barrera cutánea), usa aceite de oliva 🫒 (nutre piel), ingiere frutos secos 🥜 (omega-3 que reduce inflamación), alimentos con omega-3 🐟 (disminuyen irritación).",

    dolor_muscular_post_ejercicio: "Come plátano 🍌 (reposición de potasio), frutos secos 🥜 (magnesio y proteína), hidrátate 💧 (evita deshidratación), estira 🤸 (reduce rigidez muscular).",

    calambres: "Consume plátano 🍌 (potasio), bebe agua 💧 (hidrata y previene contracciones), come nueces 🌰 (magnesio), estira 🤸 (relaja músculo).",

    resfriado_congestion: "Bebe té de jengibre con miel 🌿🍯 (reduce inflamación y suaviza garganta), inhala vapor 🌫️ (despeja vías respiratorias), come cítricos 🍊 (vitamina C fortalece defensas), descansa 😴 (favorece recuperación).",

    dolor_cuello: "Aplica compresas calientes 🔥 (relajan músculos tensos), estira suavemente 🤸‍♂️ (mejora movilidad), consume alimentos antiinflamatorios 🐟🫒 (reducen inflamación).",

    irritacion_gastrica: "Bebe agua 💧 (hidrata mucosa), come avena 🥣 (protege estómago y regula tránsito), yogurt natural 🥛 (equilibra flora), evita picante 🌶️🚫 y reduce café ☕⬇️ (minimizan irritación).",

    colicos_menstruales: "Bebe infusiones calientes ☕ (relajan músculos y reducen dolor), come magnesio (nueces, espinaca) 🌰🥬 (favorece relajación muscular), estira suavemente 🤸 (alivia tensión).",

    dolor_rodilla: "Hidrátate 💧 (lubrica articulaciones), aplica frío ❄️ o calor 🔥 (reduce dolor y tensión), realiza movilidad 🤸 (mantiene flexibilidad).",

    dolor_hombro: "Aplica calor 🔥 (relaja músculos), estira 🤸 (aumenta movilidad), consume antiinflamatorios 🫒🐟 (reducen inflamación).",

    inflamacion_mano: "Hidrátate 💧 (mantiene líquidos en tejidos), aplica frío ❄️ (reduce inflamación y dolor), consume omega-3 🐟 (disminuye inflamación).",

    estreñimiento_leve: "Bebe agua 💧 (ayuda a ablandar heces), come frutas con fibra 🍎🥝 (estimulan tránsito), avena 🥣 (fibra soluble), camina 🚶 (estimula intestino).",

    anemia: "Consume espinaca 🥬 (hierro vegetal), lentejas 🍛 (hierro y proteína), carne magra 🥩 (hierro hemo de fácil absorción), huevos 🥚 (vitamina B12), vitamina C 🍊 (mejora absorción de hierro).",

    colon_irritable: "Come avena 🥣, plátano 🍌, arroz 🍚, verduras cocidas 🥕 (fáciles de digerir y suaves para intestino), evita irritantes 🌶️☕🚫 (minimizan inflamación intestinal).",

    dolor_estomago_leve: "Come arroz blanco 🍚 (protege mucosa), manzana rallada 🍎 (fibra soluble suave), plátano 🍌 (regula tránsito), yogurt 🥛 (flora intestinal), evita comidas pesadas 🍔🚫 (reduce sobrecarga).",

    resfriado_leve: "Bebe agua 💧 (hidrata), toma miel 🍯 (suaviza garganta), come sopa 🍲 (aporta líquidos y nutrientes), consume cítricos 🍊 (vitamina C fortalece defensas).",

    dolor_articulaciones_leve: "Hidrátate 💧 (lubrica articulaciones), estira 🤸 (mantiene movilidad), come frutos secos 🥜 (omega-3 reduce inflamación), pescado 🐟 (antiinflamatorio).",

    ansiedad_leve: "Bebe manzanilla 🍵 (calma sistema nervioso), respira profundo 😮‍💨 (reduce estrés), come chocolate negro 🍫 (estimula serotonina), frutas 🍎 (vitaminas y antioxidantes).",

    fatiga_leve: "Hidrátate 💧 (previene cansancio por deshidratación), come frutas 🍎 (azúcares naturales), frutos secos 🥜 (magnesio y proteína), camina 🚶 (estimula circulación y energía).",

    insomnio_leve: "Bebe leche tibia 🥛 (triptofano ayuda a sintetizar melatonina), respira profundo 😮‍💨 (relaja cuerpo y mente), evita pantallas 📵 (disminuye estimulación visual).",

    dolor_muscular_leve: "Hidrátate 💧 (previene deshidratación), come plátano 🍌 (potasio), frutos secos 🥜 (magnesio), estira 🤸 (reduce rigidez).",

    mareos_leves: "Bebe agua 💧 (mantiene presión sanguínea), come frutas 🍎 (glucosa para energía), descansa 😴 (evita caída), evita movimientos bruscos ⚠️ (previene vértigo).",

    congestion_nasal: "Inhala vapor 🌫️ (despeja vías respiratorias), bebe líquidos calientes ☕ (hidratación y alivio), come sopas ligeras 🍲 (nutrientes y líquidos), frutas con vitamina C 🍊 (refuerzan sistema inmune).",

    dolor_estomacal_leve: "Bebe manzanilla 🍵 (reduce espasmos), come arroz 🍚 (protege mucosa), plátano 🍌 (regula tránsito), evita comidas pesadas 🍔🚫 (reduce irritación).",

    acidez_dia: "Bebe agua 💧 (diluye ácido gástrico), come manzana 🍎 o avena 🥣 (absorbe ácido y protege estómago), evita café ☕🚫, alcohol 🍺🚫 y picantes 🌶️🚫 (disminuyen irritación).",

    acne_moderado: "Lava tu cara 🧼 (elimina sebo y bacterias), hidrátate 💧 (mantiene piel sana), come frutas 🥝 y verduras 🥦 (antioxidantes), reduce azúcares 🍬🚫 y fritos 🍟🚫 (disminuyen inflamación).",

    problemas_digestion: "Come avena 🥣, arroz 🍚, vegetales cocidos 🥕 (fáciles de digerir), yogurt 🥛 (flora intestinal), evita fritos 🍟🚫 (minimiza irritación).",

    resfriado_ninos: "Bebe agua 💧 (mantiene hidratación), consume sopa 🍲 (aporta líquidos y nutrientes), come frutas 🍌🍎 (vitaminas y energía), descansa 😴 (favorece recuperación).",

    fiebre_ninos: "Hidrátate 💧 (reposición de líquidos), come sopas ligeras 🍲 (nutrientes fáciles de digerir), frutas 🍉 (hidratan y aportan vitaminas), descansa 😴 (favorece recuperación).",

    vomito: "Bebe agua 💧 (evita deshidratación), come arroz blanco 🍚 (protege mucosa), plátano 🍌 (reposición de potasio), galletas saladas 🍘 (aportan sodio y ayudan a estabilizar estómago).",

    dolor_mandibula: "Aplica calor 🔥 (relaja músculos tensos), estira suavemente 🤸‍♂️ (reduce rigidez), consume alimentos blandos 🍲 (evita sobrecargar mandíbula).",
  }

  // ---------- Helpers ML/NLP ----------
  const normalize = (str) =>
    str.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const levenshtein = (a, b) => {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;

    const v0 = Array(b.length + 1).fill(0);
    const v1 = Array(b.length + 1).fill(0);
    for (let i = 0; i <= b.length; i++) v0[i] = i;

    for (let i = 0; i < a.length; i++) {
      v1[0] = i + 1;
      for (let j = 0; j < b.length; j++) {
        const cost = a[i] === b[j] ? 0 : 1;
        v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
      }
      for (let j = 0; j <= b.length; j++) v0[j] = v1[j];
    }
    return v1[b.length];
  };

  const similarity = (a, b) => {
    if (!a.length && !b.length) return 1;
    const dist = levenshtein(a, b);
    const maxLen = Math.max(a.length, b.length);
    return 1 - dist / maxLen;
  };

  const keysList = Object.keys(recomendaciones);

  const matchSymptomKey = (textoUsuario) => {
    const norm = normalize(textoUsuario);
    const exactKey = norm.replace(/\s+/g, "_");
    if (recomendaciones[exactKey]) return { key: exactKey, score: 1 };

    const tokens = norm.split(" ").filter(Boolean);
    if (tokens.length > 0) {
      let best = { key: null, score: 0 };
      for (const k of keysList) {
        const keyPlain = k.replace(/_/g, " ");
        const keyTokens = keyPlain.split(" ");
        const matchedTokens = tokens.filter((t) => keyTokens.includes(t)).length;
        const tokenScore = matchedTokens / Math.max(tokens.length, keyTokens.length);
        const sim = similarity(norm, keyPlain);
        const combined = 0.65 * sim + 0.35 * tokenScore;
        if (combined > best.score) best = { key: k, score: combined };
      }
      if (best.score >= 0.6) return best;
    }

    let bestSim = { key: null, score: 0 };
    for (const k of keysList) {
      const keyPlain = k.replace(/_/g, " ");
      const sim = similarity(norm, keyPlain);
      if (sim > bestSim.score) bestSim = { key: k, score: sim };
    }
    if (bestSim.score >= 0.55) return bestSim;

    return { key: null, score: 0 };
  };

  const responder = (texto) => {
    const match = matchSymptomKey(texto);
    if (match.key && recomendaciones[match.key]) {
      const mensaje = match.score < 0.8
        ? `Interpreto que te refieres a "${match.key.replace(/_/g, " ")}".\n\n${recomendaciones[match.key]}`
        : `${recomendaciones[match.key]}`;
      return `${mensaje}\n\n¿Tienes algún otro síntoma?`;
    }

    const sugerencias = ["dolor garganta", "dolor cabeza", "fiebre", "diarrea", "estreñimiento", "acidez"].join(", ");
    return `No tengo ese síntoma registrado 😕. Prueba con ejemplos: ${sugerencias}.`;
  };

  const continuarChat = (respuestaUsuario) => {
    if (respuestaUsuario.toLowerCase() === "no") {
      return "¡Gracias por usar nuestro chatbot! No olvides cuidar de ti y mantener hábitos saludables 🍀.";
    } else {
      return responder(respuestaUsuario);
    }
  };

  // ---------- Render ----------
  return (
    <>
      <div className="waves"></div>
      <div className="main-app">
        <header className="main-header">
          <div className="header-components">
            <button
              onClick={() => navigate(from)}
              className="header-icon-chat"
              style={{ background: "none", border: "none", cursor: "pointer", left: "-20px", position: "relative" }}
            >
              <ArrowLeft size={26} className="flecha-atras" />
            </button>
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

        <div className="chatBox" ref={chatBoxRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.from === "user" ? "user-msg" : "bot-msg"}`}>
              {msg.text}
            </div>
          ))}
        </div>

        <div className="inputRow">
          <input
            className="input"
            type="text"
            value={userInput}
            placeholder="Escribe tu síntoma..."
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="button" onClick={handleSend}>Enviar</button>
        </div>

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
