// ============================================================
// errorHandler.middleware.js - Manejo centralizado de errores
// ============================================================
// Este middleware captura TODOS los errores de la aplicación
// y devuelve respuestas JSON con formato consistente.
// Se registra al final de las rutas con app.use(errorHandler)
// ============================================================

/**
 * errorHandler - Middleware global de manejo de errores
 * Express reconoce este middleware por tener 4 parámetros (err, req, res, next)
 */
const errorHandler = (err, req, res, next) => {
  // Si el error tiene un código de estado personalizado, lo usamos
  // Si no, usamos 500 (Error interno del servidor)
  const statusCode = err.status || 500;

  // Mostramos el error en consola para debugging
  console.error('❌ Error:', err.message || err);

  // Respondemos con JSON en formato consistente
  res.status(statusCode).json({
    mensaje: err.message || 'Error interno del servidor',
    detalle: err.detalle || 'Ocurrió un error inesperado en el servidor'
  });
};

module.exports = errorHandler;
