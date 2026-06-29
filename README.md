<div align="center">

<a href="https://padel-time-roan.vercel.app" target="_blank">
  <img src="https://res.cloudinary.com/dabikk5ei/image/upload/padeltime/assets/logo_white.png" alt="PadelTime Logo" width="320"/>
</a>

# PadelTime — Frontend

**Aplicación web SaaS para reservas de canchas de pádel**

[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://padel-time-roan.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-orange?style=for-the-badge)](https://zustand-demo.pmnd.rs/)

🌐 **[Ver en producción](https://padel-time-roan.vercel.app)** · 🔌 **[Repositorio Backend](https://github.com/lizaldanaoyolaruiz/PadelTime-API)**

</div>

---

## 📋 Índice

- [Descripción](#-descripción)
- [Stack Tecnológico](#-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Variables de Entorno](#-variables-de-entorno)
- [Scripts Disponibles](#-scripts-disponibles)
- [Vistas y Roles](#-vistas-y-roles)
- [Equipo](#-equipo)

---

## 📖 Descripción

Este repositorio contiene el **frontend** de PadelTime, una SPA (Single Page Application) construida con React que consume la [API REST de PadelTime](https://github.com/lizaldanaoyolaruiz/PadelTime-API).

La aplicación permite a usuarios buscar complejos de pádel, consultar disponibilidad y realizar reservas. A su vez, los propietarios de complejos gestionan sus canchas, horarios y reservas desde un panel propio. Todo bajo la supervisión de un Super Administrador.

---

## 🛠️ Stack Tecnológico

| Tecnología          | Versión | Uso                           |
| ------------------- | ------- | ----------------------------- |
| **React**           | 18      | Framework principal de UI     |
| **Vite**            | 5       | Bundler y dev server          |
| **React Router**    | 6       | Navegación y rutas protegidas |
| **React Hook Form** | —       | Manejo de formularios         |
| **Zod**             | —       | Validación de esquemas        |
| **Axios**           | —       | Peticiones HTTP a la API      |
| **Zustand**         | —       | Estado global                 |
| **Librería UI**     | —       | Componentes visuales          |

---

## 📁 Estructura del Proyecto

```
📁 FRONTEND — PadelTime
│
├── index.html
├── vite.config.js
├── eslint.config.js
├── vercel.json
├── package.json
│
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    │
    ├── assets/
    │
    ├── components/
    │   ├── ClubsSection.jsx
    │   ├── CounterNumber.jsx
    │   ├── FeaturedClubs.jsx
    │   ├── Footer.jsx
    │   ├── Hero.jsx
    │   ├── Navbar.jsx
    │   ├── PadelBot.jsx
    │   ├── Solution360.jsx
    │   ├── TournamentsSection.jsx
    │   ├── WeeklyCalendar/
    │   └── ui/
    │
    ├── config/
    │   └── axios.js
    │
    ├── constants/
    │   └── cities.js
    │
    ├── pages/
    │   ├── Auth/           → Login, Register
    │   ├── Home/
    │   ├── Complexes/
    │   ├── ClubDetail/
    │   ├── CourtDetail/
    │   ├── BookingConfirmation/
    │   ├── BookingSuccess/
    │   ├── Tournaments/
    │   ├── Schedule/
    │   ├── ClientPanel/
    │   ├── Metrics/
    │   ├── Owner/
    │   │   └── components/     → AgendaTable, CourtModal, MyCourts, Reports...
    │   ├── SuperAdmin/
    │   │   └── components/     → ComplexTable, DetailDrawer, EditComplexModal...
    │   ├── AboutUs/
    │   ├── Contact/
    │   └── Error404/
    │
    ├── services/
    │   ├── authService.js
    │   ├── complexService.js
    │   ├── courtService.js
    │   ├── reservationService.js
    │   ├── reviewService.js
    │   ├── scheduleService.js
    │   ├── tournamentsService.js
    │   ├── metricsService.js
    │   └── favoriteService.js
    │
    ├── store/
    │   ├── authStore.js
    │   └── scheduleStore.js
    │
    └── utils/
        ├── alerts.js
        ├── authValidations.js
        ├── timeHelpers.js
        └── toasts.js

```

---

## 🚀 Instalación

### Prerequisitos

- Node.js >= 18.x
- npm >= 9.x
- Tener el backend corriendo (local o usar el de producción)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/lizaldanaoyolaruiz/PadelTime.git
cd PadelTime

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con los valores correspondientes

# 4. Correr en desarrollo
npm run dev
```

La app estará disponible en `http://localhost:5173`

---

## 🔐 Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3000/api
VITE_MP_PUBLIC_KEY=tu_public_key_mercadopago
```

Para apuntar al backend en producción:

```env
VITE_API_URL=https://padel-time-api.vercel.app/api
```

> ⚠️ Las variables en Vite deben comenzar con `VITE_` para ser accesibles en el cliente.

---

## 📜 Scripts Disponibles

```bash
npm run dev        # Servidor de desarrollo con hot reload
npm run build      # Build de producción (genera /dist)
npm run preview    # Preview local del build de producción
npm run lint       # Lint del código
```

---

## 🖥️ Vistas y Roles

### 🌐 Público (sin login)

- `/` — Página de inicio con complejos destacados
- `/complejos` — Listado y búsqueda de complejos
- `/complejos/:id` — Detalle de complejo con canchas y horarios
- `/login` — Inicio de sesión
- `/registro` — Registro de usuario

### 👤 Cliente (login requerido)

- `/cliente/dashboard` — Panel del cliente
- `/cliente/reservas` — Historial de reservas

### 🏟️ Propietario (login requerido)

- `/owner/dashboard` — Panel principal
- `/owner/complejo` — Gestión del complejo
- `/owner/canchas` — Gestión de canchas
- `/owner/torneos` — Gestión de torneos
- `/owner/calendario` — Calendario de reservas y torneos

### 🔧 Super Admin (login requerido)

- `/admin/dashboard` — Panel general
- `/admin/complejos` — Gestión y aprobación de complejos
- `/admin/usuarios` — Gestión de usuarios
- `/admin/usuarios` — Gestión de usuarios

---

## 👨‍💻 Equipo

| Nombre                      | Rol           |
| --------------------------- | ------------- |
| **Marisol Lamas**           | Scrum Master  |
| **Aldana Liz Oyola Ruiz**   | Líder Técnica |
| **Facundo Camaño**          | Desarrollo    |
| **Octavio Fernández Caram** | Desarrollo    |

---

## 📄 Licencia

Proyecto Final de curso © 2026 PadelTime.

---

<div align="center">

<a href="https://padel-time-roan.vercel.app" target="_blank">
  🌐 padel-time-roan.vercel.app
</a>

</div>
