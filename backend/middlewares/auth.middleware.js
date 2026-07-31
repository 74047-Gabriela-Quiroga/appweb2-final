// ============================================================
// auth.middleware.js - Middleware de autenticación JWT
// ============================================================
// Verifica que las peticiones a rutas protegidas incluyan un
// token JWT válido en el header Authorization.
// Formato esperado: "Bearer <token>"
// ============================================================

const jwt = require('jsonwebtoken');

/**
 * authMiddleware - Verifica el token JWT en cada petición protegida
 * Si el token es válido, agrega los datos del usuario a req.user
 * y permite continuar con next(). Si no, devuelve un error.
 */
const authMiddleware = (req, res, next) => {
  try {
    // Obtenemos el header Authorization de la petición
    const authHeader = req.headers.authorization;

    // Si no hay header, el usuario no envió token
    if (!authHeader) {
      return res.status(401).json({
        mensaje: 'Acceso denegado',
        detalle: 'No se proporcionó un token de autenticación'
      });
    }

    // Extraemos el token del formato "Bearer <token>"
    // split(' ') separa "Bearer" del token real
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        mensaje: 'Acceso denegado',
        detalle: 'Formato de token inválido. Use: Bearer <token>'
      });
    }

    // jwt.verify() verifica que el token sea válido y no haya expirado
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Agregamos los datos del usuario decodificado a la petición
    req.user = decoded;

    // next() pasa al siguiente middleware o a la ruta
    next();
  } catch (error) {
    // Si el token es inválido o expiró, devolvemos 401 (No autorizado)
    return res.status(401).json({
      mensaje: 'Token inválido o expirado',
      detalle: 'Inicie sesión nuevamente para obtener un nuevo token'
    });
  }
};


module.exports = authMiddleware;
