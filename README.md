# 🚀 Sistema de Gestión — Examen Final Aplicaciones Web 2

Aplicación Web Full Stack para la gestión de **Usuarios**, **Productos** y **Ventas** con autenticación JWT.

**Materia:** Aplicaciones Web 2 — IES Siglo 21

---

## 📋 Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Backend | Node.js + Express.js |
| Base de Datos | MongoDB Atlas + Mongoose |
| Frontend | HTML5 + JavaScript vanilla (ES6+) + TailwindCSS (CDN) |
| Autenticación | JWT (jsonwebtoken) + bcryptjs |

---

## 📁 Estructura del Proyecto

```
appweb2-final/
├── backend/              ← API REST (Node.js + Express)
│   ├── db/
│   │   ├── connection.js         ← Conexión a MongoDB Atlas
│   │   ├── schemas/              ← Modelos Mongoose
│   │   │   ├── user.schema.js
│   │   │   ├── product.schema.js
│   │   │   └── sale.schema.js
│   │   └── actions/              ← Lógica de negocio y CRUD
│   │       ├── user.actions.js
│   │       ├── product.actions.js
│   │       └── sale.actions.js
│   ├── routes/                   ← Enrutadores Express
│   │   ├── user.routes.js
│   │   ├── product.routes.js
│   │   └── sale.routes.js
│   ├── middlewares/
│   │   ├── auth.middleware.js     ← Verificación JWT
│   │   └── errorHandler.middleware.js ← Manejo centralizado de errores
│   ├── .env                      ← Variables de entorno (NO subir a Git)
│   ├── index.js                  ← Servidor Express principal
│   └── package.json
│
├── frontend/             ← Interfaz de usuario (HTML + JS + Tailwind)
│   ├── index.html                ← Página principal SPA
│   ├── js/
│   │   ├── services/             ← Peticiones fetch al backend
│   │   │   ├── auth.js
│   │   │   ├── products.js
│   │   │   └── sales.js
│   │   ├── components/           ← Funciones que generan HTML dinámico
│   │   │   ├── userComponents.js
│   │   │   ├── productComponents.js
│   │   │   └── saleComponents.js
│   │   └── index.js              ← Lógica principal y event listeners
│   ├── _redirects                ← Configuración Netlify
│   └── netlify.toml
│
└── README.md
```

---

## ⚙️ Ejecución Local

### Requisitos Previos

- [Node.js](https://nodejs.org/) v18 o superior
- Una cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas) con un cluster creado
- Un editor de código (VS Code recomendado)

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd appweb2-final
```

### 2. Configurar el Backend

```bash
# Entrar a la carpeta del backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
# Editar el archivo .env con tus datos:
# - MONGODB_URI: URI de conexión de MongoDB Atlas
# - JWT_SECRET: Una clave secreta para firmar los tokens
# - FRONTEND_URL: http://localhost:5500 (o el puerto de tu servidor local)

# Iniciar el servidor en modo desarrollo
npm run dev
```

El servidor estará disponible en `http://localhost:3000`.

### 3. Abrir el Frontend

Abrir el archivo `frontend/index.html` con un servidor local. Opciones:

**Opción A — Live Server (VS Code):**
1. Instalar la extensión "Live Server" en VS Code.
2. Hacer clic derecho en `index.html` → "Open with Live Server".

**Opción B — Servidor HTTP con Node.js:**
```bash
# Desde la carpeta frontend/
npx serve .
```

> ⚠️ **Importante:** El frontend DEBE abrirse desde un servidor HTTP (no como archivo `file://`) porque usa módulos ES6 (`type="module"`).

### 4. Configurar la URL del Backend en el Frontend

Para cambiar la URL del backend (por ejemplo al desplegar en Render), únicamente debes modificar la constante `API_URL` en un solo archivo:
- [config.js](file:///C:/Users/Gale/.gemini/antigravity-ide/scratch/appweb2-final/frontend/js/config.js)

```javascript
// frontend/js/config.js
export const API_URL = 'http://localhost:3000'; // Desarrollo local
// export const API_URL = 'https://tu-backend.onrender.com'; // Producción en Render
```

Todos los servicios (`auth.js`, `products.js`, `sales.js`) importan automáticamente esta variable centralizada.


---

## 🌐 Deploy (Producción)

### MongoDB Atlas (Base de Datos)

1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Crear un **Cluster** gratuito (Free Tier M0).
3. En **Database Access**, crear un usuario con contraseña.
4. En **Network Access**, agregar la IP `0.0.0.0/0` (permitir acceso desde cualquier lugar).
5. En **Connect**, obtener la **URI de conexión** y reemplazar `<password>` con la contraseña del usuario.

### Render (Backend)

1. Subir el código a un repositorio de GitHub.
2. Crear cuenta en [Render](https://render.com/).
3. Crear un nuevo **Web Service**.
4. Conectar el repositorio de GitHub.
5. Configurar:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
6. En **Environment Variables**, agregar:
   - `MONGODB_URI` = URI de MongoDB Atlas
   - `JWT_SECRET` = clave secreta para JWT
   - `FRONTEND_URL` = URL del frontend en Netlify (ej: `https://mi-app.netlify.app`)

### Netlify (Frontend)

1. Crear cuenta en [Netlify](https://www.netlify.com/).
2. Crear un nuevo sitio desde el repositorio de GitHub.
3. Configurar:
   - **Base directory:** `frontend`
   - **Publish directory:** `frontend`
   - **Build command:** (dejar vacío, es HTML estático)
4. **Importante:** Antes de deployar, actualizar la constante `API_URL` en los archivos de servicios (`frontend/js/services/`) con la URL del backend en Render.

---

## 🔑 Endpoints de la API

### Usuarios (`/users`)
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/users/register` | Registrar usuario | ❌ |
| POST | `/users/login` | Iniciar sesión | ❌ |
| GET | `/users` | Listar usuarios | ✅ |
| GET | `/users/:id` | Ver usuario por ID | ✅ |
| PUT | `/users/:id` | Actualizar usuario | ✅ |
| DELETE | `/users/:id` | Eliminar usuario | ✅ |

### Productos (`/products`)
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/products/create` | Crear producto | ✅ |
| GET | `/products` | Listar productos | ✅ |
| GET | `/products/:id` | Ver producto por ID | ✅ |
| PUT | `/products/:id` | Actualizar producto | ✅ |
| DELETE | `/products/:id` | Eliminar producto | ✅ |

### Ventas (`/sales`)
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/sales/create` | Registrar venta | ✅ |
| GET | `/sales` | Listar ventas | ✅ |
| GET | `/sales/:id` | Ver venta por ID | ✅ |
| PUT | `/sales/:id` | Actualizar venta | ✅ |
| DELETE | `/sales/:id` | Eliminar venta | ✅ |

---

## 📜 Reglas de Negocio

1. **No se puede eliminar un usuario** que tenga ventas registradas.
2. **No se puede eliminar un producto** que tenga ventas asociadas.
3. **No se puede registrar una venta** si el usuario o el producto no existen en la base de datos.

---

## 🛠️ Tecnologías y Dependencias

### Backend (package.json)
- `express` — Framework web para Node.js
- `mongoose` — ODM para MongoDB
- `dotenv` — Carga variables de entorno desde `.env`
- `cors` — Habilita peticiones cross-origin
- `bcryptjs` — Encriptación de contraseñas
- `jsonwebtoken` — Generación y verificación de tokens JWT
