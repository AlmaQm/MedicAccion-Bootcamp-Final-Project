# ProyectoFinalMedical

## Tabla de Contenidos
- [Descripción](#descripción)
- [Características Principales](#características-principales)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Configuración](#instalación-y-configuración)
- [Uso](#uso)
- [Endpoints de API (Backend)](#endpoints-de-api-backend)
- [Contribución](#contribución)
- [Roadmap](#roadmap)
- [Licencia](#licencia)

## Descripción
ProyectoFinalMedical es una aplicación web full-stack diseñada para ayudar a los usuarios a gestionar sus medicamentos de manera efectiva. Incluye funcionalidades como seguimiento de dosis, escaneo de medicamentos mediante OCR, chatbot de síntomas, calendario de medicación, perfil de usuario y sistema de recompensas por cumplimiento. El backend está construido con Django y el frontend con React/Vite.

## Roles
- **Hao Chen**: Lead y supervisor del proyecto, coordinando al equipo y apoyando en backend y manejo de datos.
- **Alma Quesada**: Desarrollo tanto de frontend como de backend y toda la parte de gestión de datos, incluyendo la lógica de medicamentos y endpoints de API.
- **Berta Grandia**: Desarrollo del frontend, incluyendo la implementación de alarmas de WhatsApp, con comunicación entre la app y las alarmas vinculadas al calendario, asegurando que las tomas se guardaran correctamente en la base de datos del sistema.
- **Mateo Garzon**: Integración y gestión de la alimentación de la IA del chatbot.

## Referencia del Proyecto Original
Este proyecto se basa en el trabajo colaborativo realizado en [ProyectoFinalMedical Original](https://github.com/trobadius/ProyectoFinalMedical.git).  

Mi contribución se centra principalmente en el backend y la gestión de datos, incluyendo:  
- Diseño y construcción de APIs con Django y Django REST Framework.  
- Modelado de la base de datos y operaciones con PostgreSQL/SQLite. 
- Frontend y funcionalidades de interacción con el usuario (React/Vite).  

En colaboración con mis compañeros:    
- Integración de notificaciones y sincronización con el calendario.  
- Gestión de la alimentación de la IA para análisis de medicamentos.  
- Integración de autenticación JWT y lógica de negocio. 

Toda la historia de commits y ramas originales se encuentra en el proyecto original.


## Características Principales
- **Gestión de Medicamentos**: Registro manual o mediante escaneo OCR de cajas de medicamentos.
- **Calendario Interactivo**: Visualización y registro de tomas diarias de medicamentos.
- **Chatbot de Síntomas**: Recomendaciones basadas en síntomas comunes, con integración de IA (OpenAI).
- **Perfil de Usuario**: Edición de datos personales y validaciones.
- **Progresos y Recompensas**: Seguimiento de cumplimiento y desbloqueo de premios.
- **Notificaciones**: Integración con WhatsApp para recordatorios.
- **Interfaz Responsiva**: Optimizada para móviles y desktop.

## Tecnologías Utilizadas
### Backend
- **Django 5.2.6**: Framework principal.
- **Django REST Framework**: Para APIs.
- **PostgreSQL/SQLite**: Base de datos.
- **JWT Authentication**: Autenticación segura.
- **Twilio**: Para notificaciones vía WhatsApp.
- **Tesseract.js**: OCR para escaneo (integrado en frontend, pero backend maneja datos).
- **AI API**: Para análisis de medicamentos.
- **Docker**: Contenedorización para despliegue.

### Frontend
- **React 18**: Biblioteca principal.
- **Vite**: Herramienta de construcción rápida.
- **React Router**: Navegación.
- **Axios**: Cliente HTTP para APIs.
- **Tesseract.js**: OCR en el navegador.
- **IA**: Para análisis de medicamentos.
- **Lucide React**: Iconos.
- **React Toastify**: Notificaciones.
- **CSS Modules**: Estilos.

### Otras
- **Python 3.13**: Lenguaje backend.
- **Node.js**: Para frontend.
- **Railway**: Plataforma de despliegue.
- **Bootstrap**: Estilos adicionales en HTML.

## Estructura del Proyecto
```
ProyectoFinalMedical/
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── entrypoint.sh
│   ├── requeriments.txt
│   ├── mediaccion/
│   │   ├── manage.py
│   │   ├── mediaccion/
│   │   │   ├── settings.py
│   │   │   ├── urls.py
│   │   │   ├── wsgi.py
│   │   │   └── asgi.py
│   │   ├── medicamentos/
│   │   │   ├── models.py
│   │   │   ├── views.py
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   ├── admin.py
│   │   │   ├── apps.py
│   │   │   ├── tests.py
│   │   │   └── migrations/
│   │   │       └── 0011_merge_20251204_1359.py
│   │   └── static/
│   └── db.sqlite3
├── Frontend/
│   └── mediaccion/
│       ├── index.html
│       ├── vite.config.js
│       ├── package.json
│       ├── eslint.config.js
│       ├── README.md
│       ├── public/
│       └── src/
│           ├── main.jsx
│           ├── App.jsx
│           ├── App.css
│           ├── api.js
│           ├── context/
│           │   └── MedContext.jsx
│           ├── components/
│           │   ├── Footer.jsx
│           │   ├── IconButton.jsx
│           │   ├── LimpiarTexto.jsx
│           │   ├── Logout.jsx
│           │   ├── NotFound.jsx
│           │   ├── OpenAiApi.jsx
│           │   ├── ProtectedRoute.jsx
│           │   ├── RemedioModal.jsx
│           │   ├── AguaModal.jsx
│           │   └── HigadoModal.jsx
│           ├── pages/
│           │   ├── Home.jsx
│           │   ├── Calendario.jsx
│           │   ├── Perfil.jsx
│           │   ├── Login.jsx
│           │   ├── Register.jsx
│           │   ├── Progresos.jsx
│           │   ├── TesseractOCR.jsx
│           │   └── Chatbot.jsx
│           ├── styles/
│           │   ├── Home.css
│           │   ├── Perfil.css
│           │   ├── Register.css
│           │   ├── Progresos.css
│           │   ├── Tesseract.css
│           │   ├── Premium.css
│           │   └── Navbar.css
│           ├── utils/
│           │   ├── calendarioColors.js
│           │   └── Validaciones.js
│           ├── assets/
│           │   ├── logo.svg
│           │   ├── logo_svg.svg
│           │   ├── scanner.png
│           │   ├── remedio.png
│           │   ├── higado_2.png
│           │   └── agua.png
│           └── data/
│               └── Recomendaciones.json
```

## Instalación y Configuración
### Prerrequisitos
- Python 3.13
- Node.js 18+
- Docker (opcional para despliegue)
- PostgreSQL o SQLite

### Backend
1. Clona el repositorio y navega a [`backend`](backend ).
2. Crea un entorno virtual: `python -m venv venv` y actívalo.
3. Instala dependencias: `pip install -r requeriments.txt`.
4. Crea un archivo `.env` en la carpeta `backend` con las siguientes variables:
   - `SECRET_KEY`: Clave secreta de Django (genera una aleatoria segura).
   - `DEBUG`: `True` para desarrollo, `False` para producción.
   - `DATABASE_URL`: URL de la base de datos (ej. `sqlite:///db.sqlite3` o PostgreSQL).
   - `OPENAI_API_KEY`: Clave de API de OpenAI para el chatbot.
   - `TWILIO_ACCOUNT_SID`: SID de cuenta Twilio.
   - `TWILIO_AUTH_TOKEN`: Token de autenticación Twilio.
   - `TWILIO_PHONE_NUMBER`: Número de teléfono Twilio.
5. Ejecuta migraciones: `python [`backend/mediaccion/manage.py`](backend/mediaccion/manage.py ) migrate`.
6. Inicia el servidor: `python [`backend/mediaccion/manage.py`](backend/mediaccion/manage.py ) runserver`.

### Frontend
1. Navega a [`Frontend/mediaccion`](Frontend/mediaccion ).
2. Instala dependencias: `npm install`.
3. Crea un archivo `.env` en la carpeta `Frontend/mediaccion` con las siguientes variables:
   - `VITE_OPENAI_API_KEY`: Clave de API de OpenAI.
   - `VITE_API_BASE_URL`: URL base del backend (ej. `http://localhost:8000`).
4. Inicia el servidor de desarrollo: `npm run dev`.

### Despliegue con Docker
- Construye la imagen: `docker build -t mediaccion-backend .` (en backend).
- Ejecuta: `docker run -p 8000:8000 mediaccion-backend`.

## Uso
- Regístrate o inicia sesión.
- En Home, registra medicamentos manualmente o escanea con OCR.
- Usa el calendario para registrar tomas.
- Interactúa con el chatbot para recomendaciones.
- Revisa progresos y desbloquea premios.

## Endpoints de API (Backend)
- [`/api/users/profile/me/`](Frontend/mediaccion/src/context/MedContext.jsx ): Perfil de usuario.
- [`/api/medicamentos/`](Frontend/mediaccion/src/context/MedContext.jsx ): CRUD de medicamentos.
- [`/api/medicamentos-programados/`](Frontend/mediaccion/src/context/MedContext.jsx ): Medicamentos programados.
- [`/api/notificaciones/whats/`](Frontend/mediaccion/src/context/MedContext.jsx ): Prueba de WhatsApp.
- [`/api/sexoedad/`](Frontend/mediaccion/src/context/MedContext.jsx ), [`/api/medicamentos-mas-registrados/`](Frontend/mediaccion/src/context/MedContext.jsx ), [`/api/busquedas-chat/`](Frontend/mediaccion/src/context/MedContext.jsx ): Estadísticas.

## Contribución
- Rama `dev` para desarrollo.
- Rama [`backend`](backend ) para cambios en backend.
- Rama [`frontend`](frontend ) para cambios en frontend.
- Usa ESLint y sigue estándares de código.

## Roadmap
- **Integración con más APIs**: Soporte para recordatorios vía email, push notifications en móviles.
- **Soporte Multiidioma**: Traducciones a inglés, español, etc.
- **Análisis Avanzado**: Reportes detallados de adherencia y predicciones de salud.
- **Aplicación Móvil**: Desarrollo de app nativa con React Native.
- **Integración con Farmacias**: Conexión directa con bases de datos de medicamentos.

## Licencia
Este proyecto es privado y propiedad de MedicAccion. Todos los derechos reservados.