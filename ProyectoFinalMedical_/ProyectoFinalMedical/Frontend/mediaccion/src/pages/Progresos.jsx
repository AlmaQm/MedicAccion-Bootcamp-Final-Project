import React, { useState, useEffect, useContext } from 'react';
import { Menu, Pill, Star, Stethoscope, ChevronRight, House, CalendarDays, Camera, ChartNoAxesCombined, UserRound } from 'lucide-react';
import '../styles/Progresos.css';
import '../App.css';
import { MessageCircle, LogOut } from 'lucide-react';
import logo from "../assets/logo.svg";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { MedContext } from "../context/MedContext.jsx";
import api from '../api';
import '../styles/Navbar.css';

// Componente Tarjeta de Premio Reutilizable
const AwardCard = ({ title, description, code, onClick }) => {
    // Determinar si el premio está desbloqueado (simulación simple)
    const isUnlocked = title.includes('Oro') || title.includes('Plata');

    return (
        <div className={`award-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
            <div className="award-info">
                <Star size={25} color="#f59e0b" fill="#f59e0b" className="award-icon" />
                <h3 className="award-title">{title}</h3>
                <p className="award-description">{description}</p>
            </div>
            <button
                className={`redeem-btn ${isUnlocked ? 'active' : 'disabled'}`}
                onClick={() => isUnlocked && onClick(title, code)}
                disabled={!isUnlocked}
            >
                {isUnlocked ? 'Canjear Premio' : 'Bloqueado'}
            </button>
        </div>
    );
};

// Componente Modal/Popup
const AwardModal = ({ prizeTitle, prizeCode, onClose }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2 className="modal-title">¡Premio Desbloqueado!</h2>
                <p className="modal-message">Aquí está tu código para canjear **{prizeTitle}**:</p>
                <div className="prize-code">{prizeCode}</div>
                <button className="modal-close-btn" onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
};

// Layout principal para /progresos con rutas anidadas
const ProgresosLayout = () => {
    /*Boton footer*/
    const navigate = useNavigate();
    const location = useLocation();

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

    return (
        <>
            <div className="waves"></div>
            <div className="main-app">
                <header className="main-header">
                    <div className="header-components">
                        <Link to="/Chatbot" className="header-icon-chat">
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

                <div className="progress-screen-custom">
                    <div className="progress-switch" style={{ textAlign: 'center', gap: 8, marginBottom: 16 }}>
                        <NavLink to="/progresos" end className={({ isActive }) => isActive ? 'tab-btn active' : 'tab-btn'} style={{ textDecoration: 'none' }}>Progresos</NavLink>
                        <NavLink to="/progresos/premios" className={({ isActive }) => isActive ? 'tab-btn active' : 'tab-btn'} style={{ textDecoration: 'none' }}>Premios</NavLink>
                    </div>

                    <main className="progress-container-custom">
                        <Outlet />
                    </main>
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
};

// Vista principal de Progresos (ruta index)
const ProgresosIndex = () => {
    const { medicamentos, setMedicamentos } = useContext(MedContext);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedMed, setSelectedMed] = useState(null);
    const [includeOlvidados, setIncludeOlvidados] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => { fetchMedicamentos(); }, []);

    const fetchMedicamentos = async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/medicamentos-programados/");
            const grouped = {};
            res.data.forEach(m => {
                if (!grouped[m.fecha]) grouped[m.fecha] = [];
                grouped[m.fecha].push(m);
            });
            setMedicamentos(grouped);
            setError(null);
        } catch (err) {
            setError("Error al cargar medicamentos");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="progress-title-custom">Centro de Progresos</h1>
            <p className="progress-subtitle-custom">Tu evolución al día: objetivos, mejoras y hábitos saludables en un solo vistazo.</p>
            {loading && <p>Cargando medicamentos...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && !error && (
                <ProgressViewShort medicamentos={medicamentos} currentDate={currentDate} setCurrentDate={setCurrentDate} includeOlvidados={includeOlvidados} setIncludeOlvidados={setIncludeOlvidados} selectedMed={selectedMed} setSelectedMed={setSelectedMed} />
            )}
        </div>
    );
};

// Vista de Premios (ruta /progresos/premios)
const PremiosView = () => {
    const awards = [
        { id: 1, title: "Medalla de Oro Mental", description: "Has completado 30 días seguidos. ¡Recibe un mes de descuentos exclusivos en farmacias asociadas!", code: "MGM-7A2B-C9D4" },
        { id: 2, title: "Plata en Consistencia", description: "5 semanas de seguimiento de hábitos sin falta. Canjea un 10% de descuento en tu próxima compra de vitaminas.", code: "PICON-F3E4-G5H6" },
        { id: 3, title: "Bronce de Iniciación", description: "Tu primera semana con la app. Desbloquea sugerencias nutricionales adaptadas a tu medicación.", code: "BRZ-8I9J-K0L1", isLocked: true }
    ];

    const [modalInfo, setModalInfo] = useState(null);
    const handleRedeem = (title, code) => setModalInfo({ title, code });
    const closeModal = () => setModalInfo(null);

    return (
        <div>
            <h1 className="progress-title-custom">Centro de Premios</h1>
            <p className="progress-subtitle-custom">¡Cada paso cuenta! Desbloquea recompensas especiales por tu dedicación al bienestar.</p>
            <div className="award-list">
                {awards.map(award => (
                    <AwardCard key={award.id} title={award.title} description={award.description} code={award.code} onClick={handleRedeem} />
                ))}
            </div>
            {modalInfo && <AwardModal prizeTitle={modalInfo.title} prizeCode={modalInfo.code} onClose={closeModal} />}
        </div>
    );
};

export default ProgresosLayout;
export { ProgresosIndex, PremiosView };

// Helper: versión reducida de ProgressView que recibe props
const ProgressViewShort = ({ medicamentos, currentDate, setCurrentDate, includeOlvidados, setIncludeOlvidados, selectedMed, setSelectedMed }) => {
    const allMeds = [];
    Object.values(medicamentos).forEach(dayMeds => dayMeds.forEach(med => { if (!allMeds.find(x => x.nombre === med.nombre)) allMeds.push(med); }));
    if (allMeds.length === 0) return <p>No tienes medicamentos registrados.</p>;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const medsThisMonth = [];
    Object.entries(medicamentos).forEach(([fecha, arr]) => { const d = new Date(fecha); if (d.getFullYear() === year && d.getMonth() === month) arr.forEach(m => medsThisMonth.push(m)); });

    const byName = {};
    medsThisMonth.forEach(m => {
        if (!byName[m.nombre]) byName[m.nombre] = { tomadas: 0, expected: 0, days: new Set() };
        byName[m.nombre].tomadas += (m.tomadas || 0);
        byName[m.nombre].expected += (m.total_tomas || 0);
        byName[m.nombre].days.add(m.fecha);
    });

    const items = Object.keys(byName).map(name => ({ nombre: name, tomadas: byName[name].tomadas, expected: byName[name].expected, dias: byName[name].days.size })).sort((a, b) => b.tomadas - a.tomadas);
    const totalTaken = items.reduce((s, it) => s + it.tomadas, 0);
    const totalExpected = items.reduce((s, it) => s + it.expected, 0);
    const totalForgotten = Math.max(0, totalExpected - totalTaken);

    const forgottenDetails = [];
    medsThisMonth.forEach(m => { const missed = (m.total_tomas || 0) - (m.tomadas || 0); if (missed > 0) forgottenDetails.push({ nombre: m.nombre, fecha: m.fecha, missed }); });

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 className="progress-subtitle-custom">Tus Medicamentos</h2>
                    <p>Tus progresos durante ({currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}):</p>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button onClick={() => { const d = new Date(currentDate); d.setMonth(d.getMonth() - 1); setCurrentDate(d); }} aria-label="Mes anterior">‹</button>
                    <button onClick={() => { const d = new Date(currentDate); d.setMonth(d.getMonth() + 1); setCurrentDate(d); }} aria-label="Mes siguiente">›</button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 20, marginTop: 12, flexWrap: 'wrap' }}>
                <div style={{ width: 360, minWidth: 260 }}>
                    <PieChart items={items} totalForgotten={totalForgotten} includeOlvidados={includeOlvidados} onSliceClick={name => setSelectedMed(name)} selected={selectedMed} />
                    <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <input type="checkbox" checked={includeOlvidados} onChange={e => setIncludeOlvidados(e.target.checked)} /> Incluir olvidados
                        </label>
                        <div style={{ marginLeft: 'auto', fontWeight: 100 }}>
                            Olvidados: {totalForgotten} ({totalExpected > 0 ? Math.round((totalForgotten / totalExpected) * 100) : 0}%)
                        </div>
                    </div>
                </div>

                <div style={{ flex: 1, minWidth: 300 }}>
                    <div style={{ marginBottom: 12, padding: 12, background: '#f3f4f6', borderRadius: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ fontWeight: 600 }}>Progreso General</span>
                            <span style={{ fontWeight: 600 }}>{Math.round(totalTaken / (totalExpected || 1) * 100)}%</span>
                        </div>
                        <div style={{ background: '#e5e7eb', borderRadius: 8, overflow: 'hidden', height: 14 }}>
                            <div style={{ width: `${Math.round(totalTaken / (totalExpected || 1) * 100)}%`, height: '100%', background: '#10b981', transition: 'width 0.3s ease' }} />
                        </div>
                    </div>

                    {selectedMed ? (
                        <div>
                            <h3 style={{ marginTop: 0, fontSize: '1rem' }}>{selectedMed} — Resumen del mes</h3>
                            {selectedMed === 'Olvidados' ? (
                                <div style={{ padding: 12, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }}>
                                    <h4 style={{ margin: 0, marginBottom: 8, fontSize: '0.95rem' }}>Desglose de medicamentos olvidados</h4>
                                    {forgottenDetails.length === 0 ? (
                                        <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>No hay olvidos registrados este mes.</p>
                                    ) : (
                                        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                                            {forgottenDetails.map((f, i) => (
                                                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.9rem' }}>
                                                    <span style={{ fontWeight: 600 }}>{f.nombre}</span>
                                                    <span style={{ color: '#6b7280' }}>{f.fecha} — {f.missed} olvidada(s)</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ) : (
                                (() => {
                                    const data = items.find(it => it.nombre === selectedMed);
                                    if (!data) return <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>No hay datos para este medicamento este mes.</p>;
                                    const pct = data.expected > 0 ? Math.round(data.tomadas / data.expected * 100) : 0;
                                    return (
                                        <div style={{ padding: 12, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <strong style={{ fontSize: '0.95rem' }}>Tomas totales</strong>
                                                <span style={{ fontSize: '0.95rem' }}>{data.tomadas}/{data.expected}</span>
                                            </div>
                                            <div style={{ height: 10, background: '#e5e7eb', borderRadius: 6, overflow: 'hidden', marginTop: 8 }}>
                                                <div style={{ width: `${pct}%`, height: '100%', background: '#3b82f6' }} />
                                            </div>
                                            <p style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: 8 }}>Días con tomas registradas: {data.dias}</p>
                                        </div>
                                    );
                                })()
                            )}
                        </div>
                    ) : (
                        <div>
                            <h3 style={{ fontSize: '1rem' }}>Medicamentos del mes</h3>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Haz click en un segmento del gráfico para ver el resumen mensual.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ===== PieChart component (inline, simple SVG) ===== */
function PieChart({ items, totalForgotten = 0, includeOlvidados = true, onSliceClick, selected }) {
    // items: [{nombre, tomadas}]
    const data = items.map(it => ({ label: it.nombre, value: it.tomadas }));
    if (includeOlvidados && totalForgotten > 0) data.push({ label: 'Olvidados', value: totalForgotten });

    const total = data.reduce((s, d) => s + d.value, 0) || 1;
    const radius = 90;
    const cx = radius + 10;
    const cy = radius + 10;
    let angle = -90; // start at top

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#7c4dff', '#06b6d4', '#f97316', '#8b5cf6'];

    return (
        <div className="pie-chart">
            <svg width={(radius + 10) * 2} height={(radius + 10) * 2} viewBox={`0 0 ${(radius + 10) * 2} ${(radius + 10) * 2}`}>
                {data.map((d, i) => {
                    const value = d.value;
                    const portion = value / total;
                    const sliceAngle = portion * 360;
                    const large = sliceAngle > 180 ? 1 : 0;
                    const start = angle;
                    const end = angle + sliceAngle;
                    const startRad = (Math.PI / 180) * start;
                    const endRad = (Math.PI / 180) * end;
                    const x1 = cx + radius * Math.cos(startRad);
                    const y1 = cy + radius * Math.sin(startRad);
                    const x2 = cx + radius * Math.cos(endRad);
                    const y2 = cy + radius * Math.sin(endRad);

                    // centroid for pull-out effect
                    const midAngle = (start + end) / 2;
                    const midRad = (Math.PI / 180) * midAngle;
                    const offset = selected === d.label ? 10 : 0;
                    const tx = Math.cos(midRad) * offset;
                    const ty = Math.sin(midRad) * offset;

                    const path = `M ${cx + tx} ${cy + ty} L ${x1 + tx} ${y1 + ty} A ${radius} ${radius} 0 ${large} 1 ${x2 + tx} ${y2 + ty} Z`;
                    angle += sliceAngle;

                    return (
                        <path key={d.label} d={path} fill={colors[i % colors.length]} stroke="#fff" strokeWidth={1.5}
                            className={`slice ${selected === d.label ? 'active' : ''}`}
                            onClick={() => onSliceClick && onSliceClick(d.label)}
                            style={{ cursor: 'pointer' }} />
                    );
                })}
                {/* center circle for donut look */}
                <circle cx={cx} cy={cy} r={radius * 0.5} fill="#ffffff" />
            </svg>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {data.map((d, i) => (
                    <div key={d.label} style={{ display: 'flex', gap: 8, alignItems: 'center', minWidth: 120 }}>
                        <div style={{ width: 12, height: 12, background: colors[i % colors.length], borderRadius: 3 }} />
                        <div style={{ fontSize: '0.9rem' }}>{d.label} — {d.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}