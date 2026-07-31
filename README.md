# 🚀 Sistema de Gestión — Examen Final Aplicaciones Web 2

Aplicación Web Full Stack para la gestión de **Usuarios**, **Productos** y **Ventas** (con soporte para múltiples productos por venta) y autenticación mediante JWT.

**Materia:** Aplicaciones Web 2 — IES Siglo 21

---

## 📋 Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Backend | Node.js + Express.js |
| Base de Datos | MongoDB Atlas + Mongoose |
| Frontend | HTML5 + JavaScript vanilla (ES6+ modular) + TailwindCSS (CDN) |
| Autenticación | JWT (jsonwebtoken) + bcryptjs |

---

## 📁 Estructura del Proyecto

```
appweb2-final/
├── backend/              ← API REST (Node.js + Express)
│   ├── db/
│   │   ├── connection.js         ← Conexión con caché a MongoDB Atlas
│   │   ├── schemas/              ← Modelos Mongoose
│   │   │   ├── user.schema.js
│   │   │   ├── product.schema.js
│   │   │   └── sale.schema.js    ← Soporte para array de productos por venta
│   │   └── actions/              ← Lógica de negocio y CRUD
│   │       ├── user.actions.js
│   │       ├── product.actions.js
│   │       └── sale.actions.js
│   ├── routes/                   ← Enrutadores Express
│   │   ├── user.routes.js
│   │   ├── product.routes.js
│   │   └── sale.routes.js
│   ├── middlewares/
│   │   ├── auth.middleware.js     ← Verificación JWT (retorna HTTP 401)
│   │   └── errorHandler.middleware.js ← Manejo centralizado de errores
│   ├── index.js                  ← Servidor Express principal (CORS habilitado)
│   └── package.json
│
├── frontend/             ← Interfaz de usuario (HTML + JS + Tailwind)
│   ├── index.html                ← Página principal SPA
│   ├── js/
│   │   ├── config.js             ← Configuración centralizada de API_URL
│   │   ├── services/             ← Peticiones fetch al backend
│   │   │   ├── auth.js           ← Login, registro y CRUD de usuarios
│   │   │   ├── products.js       ← CRUD de productos
│   │   │   └── sales.js          ← CRUD de ventas
│   │   ├── components/           ← Funciones que generan HTML dinámico
│   │   │   ├── userComponents.js
│   │   │   ├── productComponents.js
│   │   │   └── saleComponents.js ← Formulario dinámico con N productos
│   │   └── index.js              ← SPA Router, manejo de sesión y eventos
│
└── README.md

```

---

## 🌐 Despliegue en Producción

### Base de Datos (MongoDB Atlas)
1. Crear cluster en MongoDB Atlas (Free Tier M0).
2. Crear un usuario de base de datos y configurar IP Whitelist `0.0.0.0/0` (Network Access).
3. Copiar la **URI de conexión** para agregarla en Render.

### Backend (Render)
1. Crear un Web Service en [Render](https://render.com/).
2. Directorio Raíz (`Root Directory`): `backend`
3. Comando de Construcción (`Build Command`): `npm install`
4. Comando de Inicio (`Start Command`): `npm start`
5. Variables de entorno en Render:
   - `MONGODB_URI`: La URI de Atlas
   - `JWT_SECRET`: Tu clave secreta para JWT

### Frontend (Netlify)
1. Crear un nuevo sitio desde Git en [Netlify](https://www.netlify.com/).
2. Directorio base: `frontend`
3. Antes de subir cambios, actualizar `frontend/js/config.js` con la URL HTTPS de tu backend en Render.

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
| POST | `/sales/create` | Registrar venta con array de productos | ✅ |
| GET | `/sales` | Listar ventas (con `populate` de usuario y productos) | ✅ |
| GET | `/sales/:id` | Ver venta por ID (con `populate`) | ✅ |
| PUT | `/sales/:id` | Actualizar venta | ✅ |
| DELETE | `/sales/:id` | Eliminar venta | ✅ |

---

## 📜 Reglas de Negocio & Comportamientos Clave

1. **Ventas Múltiples**: Una venta puede incluir **uno o más productos**, especificando la cantidad individual de cada uno.
2. **Restricciones de Eliminación**:
   - **No se puede eliminar un usuario** que tenga ventas registradas.
   - **No se puede eliminar un producto** que esté asociado a alguna venta existente.
3. **Validación de Existencia**: No se puede registrar una venta si el usuario o alguno de los productos seleccionados no existen en la base de datos.
4. **Gestión de Sesión & Expiración**:
   - El token JWT y datos de usuario se almacenan en `sessionStorage` (se destruyen al cerrar la pestaña).
   - Ante respuestas HTTP `401 Unauthorized` (token expirado o inválido), la app redirige automáticamente a la pantalla de login.

---

## 🛠️ Dependencias del Proyecto

### Backend (`package.json`)
- `express` — Framework HTTP
- `mongoose` — ODM de MongoDB
- `dotenv` — Variables de entorno
- `cors` — Configuración CORS dinámica
- `bcryptjs` — Encriptación de contraseñas
- `jsonwebtoken` — Autenticación JWT
