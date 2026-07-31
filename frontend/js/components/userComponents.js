// ============================================================
// userComponents.js - Componentes HTML para la sección Usuarios
// ============================================================
// Funciones que retornan strings de HTML para renderizar
// la tabla de usuarios y los formularios de crear/editar.
// ============================================================

/**
 * renderUsersSection - Genera el HTML completo de la sección Usuarios
 * Incluye un header con botón de crear y la tabla de usuarios.
 * @param {Array} users - Lista de usuarios desde la API
 * @returns {String} HTML de la sección
 */
export const renderUsersSection = (users) => {
  return `
    <div class="section-view">
      <!-- Header de la sección -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 class="text-2xl font-bold text-surface-900">👥 Usuarios</h2>
          <p class="text-surface-500 text-sm mt-1">Gestión de usuarios del sistema</p>
        </div>
        <button onclick="openCreateUserModal()" id="btn-create-user"
          class="btn-primary px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl shadow-md text-sm flex items-center gap-2">
          <span>+</span> Nuevo Usuario
        </button>
      </div>

      <!-- Tabla de usuarios -->
      <div class="glass-card rounded-2xl shadow-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full" id="users-table">
            <thead>
              <tr class="bg-surface-50 border-b border-surface-200">
                <th class="text-left py-3.5 px-5 text-xs font-semibold text-surface-500 uppercase tracking-wider">Nombre</th>
                <th class="text-left py-3.5 px-5 text-xs font-semibold text-surface-500 uppercase tracking-wider">Usuario</th>
                <th class="text-left py-3.5 px-5 text-xs font-semibold text-surface-500 uppercase tracking-wider">Creado</th>
                <th class="text-right py-3.5 px-5 text-xs font-semibold text-surface-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-surface-100">
              ${users.length === 0
                ? `<tr><td colspan="4" class="text-center py-12 text-surface-400">No hay usuarios registrados</td></tr>`
                : users.map(user => renderUserRow(user)).join('')
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Contador -->
      <p class="text-surface-400 text-xs mt-3 text-right">${users.length} usuario(s) en total</p>
    </div>
  `;
};

/**
 * renderUserRow - Genera una fila de la tabla para un usuario
 * @param {Object} user - Datos del usuario
 * @returns {String} HTML de la fila <tr>
 */
const renderUserRow = (user) => {
  // Formateamos la fecha de creación
  const createdDate = new Date(user.createdAt).toLocaleDateString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  // Primera letra del nombre para el avatar
  const initial = user.name.charAt(0).toUpperCase();

  return `
    <tr class="table-row-hover">
      <td class="py-3.5 px-5">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-white text-xs font-bold">${initial}</span>
          </div>
          <span class="font-medium text-surface-800 text-sm">${user.name}</span>
        </div>
      </td>
      <td class="py-3.5 px-5">
        <span class="text-sm text-surface-600 bg-surface-100 px-2.5 py-1 rounded-lg font-mono">@${user.username}</span>
      </td>
      <td class="py-3.5 px-5 text-sm text-surface-500">${createdDate}</td>
      <td class="py-3.5 px-5">
        <div class="flex justify-end gap-2">
          <button onclick="openEditUserModal('${user._id}')" title="Editar"
            class="p-2 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors duration-200 text-sm">
            ✏️
          </button>
          <button onclick="handleDeleteUser('${user._id}')" title="Eliminar"
            class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 text-sm">
            🗑️
          </button>
        </div>
      </td>
    </tr>
  `;
};

/**
 * renderUserFormModal - Genera el formulario para crear o editar usuario
 * @param {Object|null} user - Si es null, es crear. Si tiene datos, es editar.
 * @returns {String} HTML del formulario
 */
export const renderUserFormModal = (user = null) => {
  const isEdit = user !== null;
  const title = isEdit ? 'Editar Usuario' : 'Nuevo Usuario';
  const buttonText = isEdit ? 'Guardar Cambios' : 'Crear Usuario';

  return `
    <div>
      <h3 class="text-xl font-bold text-surface-900 mb-1">${title}</h3>
      <p class="text-surface-500 text-sm mb-6">${isEdit ? 'Modifique los datos del usuario' : 'Complete los datos del nuevo usuario'}</p>

      <form id="user-form" onsubmit="handleSaveUser(event, '${isEdit ? user._id : ''}')" class="space-y-4">
        <div>
          <label for="form-user-name" class="block text-sm font-medium text-surface-700 mb-1.5">Nombre completo</label>
          <input type="text" id="form-user-name" required value="${isEdit ? user.name : ''}" placeholder="Ej: Juan Pérez"
            class="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
        </div>
        <div>
          <label for="form-user-username" class="block text-sm font-medium text-surface-700 mb-1.5">Nombre de usuario</label>
          <input type="text" id="form-user-username" required value="${isEdit ? user.username : ''}" placeholder="Ej: juanperez"
            class="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
        </div>
        <div>
          <label for="form-user-password" class="block text-sm font-medium text-surface-700 mb-1.5">
            Contraseña ${isEdit ? '(dejar vacío para no cambiar)' : ''}
          </label>
          <input type="password" id="form-user-password" ${isEdit ? '' : 'required'} placeholder="${isEdit ? 'Nueva contraseña (opcional)' : 'Ingrese una contraseña'}"
            class="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
        </div>

        <div id="form-user-error" class="hidden p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl"></div>

        <div class="flex gap-3 pt-2">
          <button type="button" onclick="closeModal()"
            class="flex-1 py-2.5 bg-surface-100 text-surface-700 font-semibold rounded-xl hover:bg-surface-200 transition-colors duration-200 text-sm">
            Cancelar
          </button>
          <button type="submit"
            class="btn-primary flex-1 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl shadow-md text-sm">
            ${buttonText}
          </button>
        </div>
      </form>
    </div>
  `;
};
