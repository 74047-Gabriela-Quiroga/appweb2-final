// ============================================================
// index.js - Archivo principal del Frontend (SPA)
// ============================================================
// Este archivo es el punto de entrada del frontend.
// Maneja la navegación entre secciones, los event listeners,
// la autenticación y la comunicación con los servicios fetch.
// ============================================================

// ==================== IMPORTS ====================

// Servicios (peticiones fetch al backend)
import { loginUser, registerUser, getAllUsers, getUserById, updateUser, deleteUser } from './services/auth.js';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from './services/products.js';
import { createSale, getAllSales, getSaleById, updateSale, deleteSale } from './services/sales.js';

// Componentes (funciones que generan HTML)
import { renderUsersSection, renderUserFormModal } from './components/userComponents.js';
import { renderProductsSection, renderProductFormModal } from './components/productComponents.js';
import { renderSalesSection, renderSaleFormModal } from './components/saleComponents.js';

// ==================== REFERENCIAS AL DOM ====================

const authSection = document.getElementById('auth-section');
const navbar = document.getElementById('navbar');
const mainContent = document.getElementById('main-content');
const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');
const toastContainer = document.getElementById('toast-container');

// ==================== ESTADO DE LA APLICACIÓN ====================

// Variable que guarda la sección activa ('users', 'products', 'sales')
let currentSection = 'users';

// ============================================================
// FUNCIONES DE UTILIDAD
// ============================================================

/**
 * showToast - Muestra una notificación temporal (toast)
 * @param {String} message - Mensaje a mostrar
 * @param {String} type - Tipo: 'success', 'error', 'info'
 */
function showToast(message, type = 'success') {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-primary-500'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${colors[type]} text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium max-w-sm`;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  // Eliminamos el toast después de 3 segundos
  setTimeout(() => toast.remove(), 3000);
}

/**
 * openModal - Abre el modal genérico con el contenido especificado
 * @param {String} htmlContent - HTML a mostrar dentro del modal
 */
function openModal(htmlContent) {
  modalContent.innerHTML = htmlContent;
  modalOverlay.classList.remove('hidden');
}

/**
 * closeModal - Cierra el modal genérico
 */
function closeModal() {
  modalOverlay.classList.add('hidden');
  modalContent.innerHTML = '';
}

// ============================================================
// AUTENTICACIÓN (Login / Registro / Logout)
// ============================================================

/**
 * switchAuthTab - Cambia entre las pestañas de Login y Registro
 * @param {String} tab - 'login' o 'register'
 */
function switchAuthTab(tab) {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const authError = document.getElementById('auth-error');

  // Ocultamos el mensaje de error
  authError.classList.add('hidden');

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    tabLogin.className = 'flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 bg-white text-primary-600 shadow-sm';
    tabRegister.className = 'flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 text-surface-500 hover:text-surface-700';
  } else {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    tabRegister.className = 'flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 bg-white text-primary-600 shadow-sm';
    tabLogin.className = 'flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 text-surface-500 hover:text-surface-700';
  }
}

/**
 * handleLogin - Maneja el envío del formulario de login
 * @param {Event} event - Evento del formulario
 */
async function handleLogin(event) {
  event.preventDefault(); // Evitamos que el formulario recargue la página
  const authError = document.getElementById('auth-error');

  try {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    // Llamamos al servicio de login
    const result = await loginUser(username, password);

    authError.classList.add('hidden');
    showToast(`¡Bienvenido, ${result.user.name}!`, 'success');

    // Mostramos la aplicación principal
    showApp();
  } catch (error) {
    authError.textContent = error.message;
    authError.classList.remove('hidden');
  }
}

/**
 * handleRegister - Maneja el envío del formulario de registro
 * @param {Event} event - Evento del formulario
 */
async function handleRegister(event) {
  event.preventDefault();
  const authError = document.getElementById('auth-error');

  try {
    const name = document.getElementById('register-name').value;
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    await registerUser({ name, username, password });

    authError.classList.add('hidden');
    showToast('¡Cuenta creada! Ahora inicie sesión', 'success');

    // Cambiamos a la pestaña de login
    switchAuthTab('login');
    document.getElementById('register-form').reset();
  } catch (error) {
    authError.textContent = error.message;
    authError.classList.remove('hidden');
  }
}

/**
 * handleLogout - Cierra la sesión del usuario
 */
function handleLogout() {
  // Eliminamos el token y los datos del usuario de sessionStorage
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');

  // Mostramos la sección de login y ocultamos la app
  authSection.classList.remove('hidden');
  navbar.classList.add('hidden');
  mainContent.classList.add('hidden');

  showToast('Sesión cerrada', 'info');
}


/**
 * handleApiError - Verifica si un error fue por autenticación (401/403 o token rechazado).
 * Si es así, cierra la sesión y redirige al login automáticamente.
 * @param {Error} error - Error capturado
 * @returns {Boolean} true si fue un error de autenticación manejado
 */
function handleApiError(error) {
  if (
    error.status === 401 ||
    error.status === 403 ||
    error.message.includes('Token') ||
    error.message.includes('token') ||
    error.message.includes('Acceso denegado') ||
    error.message.includes('Inicie sesión')
  ) {
    handleLogout();
    showToast('Sesión expirada o no autorizada. Redirigiendo al login...', 'error');
    return true;
  }
  return false;
}


/**
 * showApp - Muestra la aplicación principal (después del login)
 */
function showApp() {
  // Obtenemos los datos del usuario guardados en sessionStorage
  const user = JSON.parse(sessionStorage.getItem('user'));

  // Actualizamos el navbar con los datos del usuario
  document.getElementById('user-display-name').textContent = user.name;
  document.getElementById('user-avatar').textContent = user.name.charAt(0).toUpperCase();

  // Ocultamos el login y mostramos la app
  authSection.classList.add('hidden');
  navbar.classList.remove('hidden');
  mainContent.classList.remove('hidden');

  // Cargamos la sección inicial (usuarios)
  navigateTo('users');
}


// ============================================================
// NAVEGACIÓN ENTRE SECCIONES
// ============================================================

/**
 * navigateTo - Navega a una sección específica de la SPA
 * @param {String} section - 'users', 'products' o 'sales'
 */
async function navigateTo(section) {
  currentSection = section;

  // Actualizamos los estilos de los links de navegación
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('bg-primary-50', 'text-primary-600');
    link.classList.add('text-surface-600');
  });
  const activeLink = document.getElementById(`nav-${section}`);
  if (activeLink) {
    activeLink.classList.add('bg-primary-50', 'text-primary-600');
    activeLink.classList.remove('text-surface-600');
  }

  // Mostramos un loading mientras cargamos los datos
  mainContent.innerHTML = `
    <div class="flex justify-center items-center py-20">
      <div class="spinner"></div>
      <span class="ml-3 text-surface-500 text-sm">Cargando...</span>
    </div>
  `;

  try {
    // Según la sección, cargamos los datos correspondientes
    switch (section) {
      case 'users':
        const users = await getAllUsers();
        mainContent.innerHTML = renderUsersSection(users);
        break;

      case 'products':
        const products = await getAllProducts();
        mainContent.innerHTML = renderProductsSection(products);
        break;

      case 'sales':
        const sales = await getAllSales();
        mainContent.innerHTML = renderSalesSection(sales);
        break;
    }
  } catch (error) {
    // Si el error fue por autenticación (token rechazado/expirado), redirigimos al login
    if (handleApiError(error)) return;

    mainContent.innerHTML = `
      <div class="text-center py-20">
        <p class="text-red-500 text-lg font-medium">Error al cargar datos</p>
        <p class="text-surface-400 text-sm mt-2">${error.message}</p>
        <button onclick="navigateTo('${section}')" class="mt-4 px-4 py-2 bg-primary-500 text-white rounded-xl text-sm">
          Reintentar
        </button>
      </div>
    `;
  }

}

// ============================================================
// CRUD DE USUARIOS
// ============================================================

/** Abre el modal para crear un usuario */
function openCreateUserModal() {
  openModal(renderUserFormModal(null));
}

/** Abre el modal para editar un usuario */
async function openEditUserModal(id) {
  try {
    const user = await getUserById(id);
    openModal(renderUserFormModal(user));
  } catch (error) {
    if (handleApiError(error)) return;
    showToast(error.message, 'error');
  }
}

/**
 * handleSaveUser - Guarda (crea o actualiza) un usuario
 * @param {Event} event - Evento del formulario
 * @param {String} id - ID del usuario (vacío si es crear)
 */
async function handleSaveUser(event, id) {
  event.preventDefault();
  const errorDiv = document.getElementById('form-user-error');

  try {
    const userData = {
      name: document.getElementById('form-user-name').value,
      username: document.getElementById('form-user-username').value
    };

    // Solo incluimos la contraseña si se escribió algo
    const password = document.getElementById('form-user-password').value;
    if (password) {
      userData.password = password;
    }

    if (id) {
      // Editar usuario existente
      await updateUser(id, userData);
      showToast('Usuario actualizado correctamente', 'success');
    } else {
      // Crear nuevo usuario (la contraseña es obligatoria)
      if (!password) {
        throw new Error('La contraseña es obligatoria para crear un usuario');
      }
      userData.password = password;
      await registerUser(userData);
      showToast('Usuario creado correctamente', 'success');
    }

    closeModal();
    navigateTo('users'); // Recargamos la lista
  } catch (error) {
    if (handleApiError(error)) return;
    errorDiv.textContent = error.message;
    errorDiv.classList.remove('hidden');
  }
}

/**
 * handleDeleteUser - Elimina un usuario con confirmación
 * @param {String} id - ID del usuario a eliminar
 */
async function handleDeleteUser(id) {
  // Pedimos confirmación antes de eliminar
  if (!confirm('¿Está seguro de que desea eliminar este usuario?')) return;

  try {
    await deleteUser(id);
    showToast('Usuario eliminado correctamente', 'success');
    navigateTo('users'); // Recargamos la lista
  } catch (error) {
    if (handleApiError(error)) return;
    showToast(error.message, 'error');
  }
}


// ============================================================
// CRUD DE PRODUCTOS
// ============================================================

function openCreateProductModal() {
  openModal(renderProductFormModal(null));
}

async function openEditProductModal(id) {
  try {
    const product = await getProductById(id);
    openModal(renderProductFormModal(product));
  } catch (error) {
    if (handleApiError(error)) return;
    showToast(error.message, 'error');
  }
}

async function handleSaveProduct(event, id) {
  event.preventDefault();
  const errorDiv = document.getElementById('form-product-error');

  try {
    const productData = {
      name: document.getElementById('form-product-name').value,
      desc: document.getElementById('form-product-desc').value,
      price: parseFloat(document.getElementById('form-product-price').value),
      stock: parseInt(document.getElementById('form-product-stock').value),
      category: document.getElementById('form-product-category').value
    };

    if (id) {
      await updateProduct(id, productData);
      showToast('Producto actualizado correctamente', 'success');
    } else {
      await createProduct(productData);
      showToast('Producto creado correctamente', 'success');
    }

    closeModal();
    navigateTo('products');
  } catch (error) {
    if (handleApiError(error)) return;
    errorDiv.textContent = error.message;
    errorDiv.classList.remove('hidden');
  }
}

async function handleDeleteProduct(id) {
  if (!confirm('¿Está seguro de que desea eliminar este producto?')) return;

  try {
    await deleteProduct(id);
    showToast('Producto eliminado correctamente', 'success');
    navigateTo('products');
  } catch (error) {
    if (handleApiError(error)) return;
    showToast(error.message, 'error');
  }
}

// ============================================================
// CRUD DE VENTAS
// ============================================================

/** Abre el modal de nueva venta cargando usuarios y productos disponibles */
async function openCreateSaleModal() {
  try {
    // Necesitamos cargar las listas de usuarios y productos para los selects
    const [users, products] = await Promise.all([getAllUsers(), getAllProducts()]);
    openModal(renderSaleFormModal(users, products, null));
  } catch (error) {
    if (handleApiError(error)) return;
    showToast(error.message, 'error');
  }
}

async function openEditSaleModal(id) {
  try {
    const [sale, users, products] = await Promise.all([
      getSaleById(id),
      getAllUsers(),
      getAllProducts()
    ]);
    openModal(renderSaleFormModal(users, products, sale));
  } catch (error) {
    if (handleApiError(error)) return;
    showToast(error.message, 'error');
  }
}

async function handleSaveSale(event, id) {
  event.preventDefault();
  const errorDiv = document.getElementById('form-sale-error');

  try {
    const user = document.getElementById('form-sale-user').value;
    const rows = document.querySelectorAll('.sale-product-row');

    if (!user) {
      throw new Error('Debe seleccionar un usuario/cliente');
    }

    if (!rows || rows.length === 0) {
      throw new Error('Debe agregar al menos un producto');
    }

    const products = [];
    let calculatedTotal = 0;

    rows.forEach(row => {
      const select = row.querySelector('.product-select');
      const quantityInput = row.querySelector('.product-quantity');

      const productId = select.value;
      const selectedOption = select.options[select.selectedIndex];
      const unitPrice = selectedOption ? parseFloat(selectedOption.getAttribute('data-price')) || 0 : 0;
      const quantity = parseInt(quantityInput.value) || 1;

      if (productId) {
        products.push({
          product: productId,
          quantity: quantity,
          unitPrice: unitPrice
        });
        calculatedTotal += unitPrice * quantity;
      }
    });

    if (products.length === 0) {
      throw new Error('Debe seleccionar al menos un producto válido');
    }

    const saleData = {
      user,
      products,
      totalPrice: parseFloat(calculatedTotal.toFixed(2))
    };

    if (id) {
      await updateSale(id, saleData);
      showToast('Venta actualizada correctamente', 'success');
    } else {
      await createSale(saleData);
      showToast('Venta registrada correctamente', 'success');
    }

    closeModal();
    navigateTo('sales');
  } catch (error) {
    if (handleApiError(error)) return;
    errorDiv.textContent = error.message;
    errorDiv.classList.remove('hidden');
  }
}

async function handleDeleteSale(id) {
  if (!confirm('¿Está seguro de que desea eliminar esta venta?')) return;

  try {
    await deleteSale(id);
    showToast('Venta eliminada correctamente', 'success');
    navigateTo('sales');
  } catch (error) {
    if (handleApiError(error)) return;
    showToast(error.message, 'error');
  }
}

/**
 * addProductRowToSaleModal - Agrega una nueva fila de producto al modal de venta
 */
function addProductRowToSaleModal() {
  const container = document.getElementById('sale-products-container');
  if (!container) return;

  const products = window.availableProducts || [];
  const index = container.children.length;

  // Importamos y usamos renderProductRowInput si está disponible en scope
  const tempDiv = document.createElement('div');
  const productOptions = products.map(p => `
    <option value="${p._id}" data-price="${p.price}">
      ${p.name} ($${p.price})
    </option>
  `).join('');

  tempDiv.innerHTML = `
    <div class="sale-product-row flex items-center gap-2 bg-surface-50 p-2.5 rounded-xl border border-surface-200">
      <select onchange="calculateSaleTotal()" required
        class="product-select flex-1 px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
        <option value="" data-price="0">Seleccionar producto...</option>
        ${productOptions}
      </select>

      <div class="w-20">
        <input type="number" min="1" value="1" oninput="calculateSaleTotal()" onchange="calculateSaleTotal()" required
          class="product-quantity w-full px-2 py-2 bg-white border border-surface-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Cant.">
      </div>

      <button type="button" onclick="removeProductRowFromSaleModal(this)" title="Quitar producto"
        class="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg text-xs font-bold transition-colors">
        ✕
      </button>
    </div>
  `;

  container.appendChild(tempDiv.firstElementChild);
  calculateSaleTotal();
}

/**
 * removeProductRowFromSaleModal - Elimina una fila de producto del modal de venta
 * @param {HTMLElement} btnElement - Botón ✕ presionado
 */
function removeProductRowFromSaleModal(btnElement) {
  const container = document.getElementById('sale-products-container');
  const rows = container.querySelectorAll('.sale-product-row');

  // Permitir eliminar solo si hay más de 1 fila
  if (rows.length > 1) {
    btnElement.closest('.sale-product-row').remove();
    calculateSaleTotal();
  } else {
    showToast('La venta debe contener al menos un producto', 'info');
  }
}

/**
 * calculateSaleTotal - Recorre todas las filas de productos y calcula el total acumulado
 */
function calculateSaleTotal() {
  const rows = document.querySelectorAll('.sale-product-row');
  let total = 0;

  rows.forEach(row => {
    const select = row.querySelector('.product-select');
    const quantityInput = row.querySelector('.product-quantity');

    if (select && quantityInput) {
      const selectedOption = select.options[select.selectedIndex];
      const price = selectedOption ? parseFloat(selectedOption.getAttribute('data-price')) || 0 : 0;
      const quantity = parseInt(quantityInput.value) || 0;

      total += price * quantity;
    }
  });

  const totalInput = document.getElementById('form-sale-total');
  if (totalInput) {
    totalInput.value = total.toFixed(2);
  }
}



/**
 * handleProductSelectChange - Calcula el total al cambiar el producto seleccionado
 * Toma el precio del producto del atributo data-price del option
 */
function handleProductSelectChange() {
  calculateTotal();
}

/**
 * calculateTotal - Calcula el precio total (precio del producto × cantidad)
 */
function calculateTotal() {
  const productSelect = document.getElementById('form-sale-product');
  const quantityInput = document.getElementById('form-sale-quantity');
  const totalInput = document.getElementById('form-sale-total');

  // Obtenemos el precio del producto seleccionado desde data-price
  const selectedOption = productSelect.options[productSelect.selectedIndex];
  const price = selectedOption ? parseFloat(selectedOption.getAttribute('data-price')) : 0;
  const quantity = parseInt(quantityInput.value) || 0;

  if (price && quantity) {
    totalInput.value = (price * quantity).toFixed(2);
  }
}

// ============================================================
// INICIALIZACIÓN DE LA APP
// ============================================================

/**
 * Al cargar la página, verificamos si hay un token guardado.
 * Si existe, mostramos la app directamente (sesión activa).
 * Si no, mostramos el formulario de login.
 */
document.addEventListener('DOMContentLoaded', () => {
  const token = sessionStorage.getItem('token');
  const user = sessionStorage.getItem('user');

  if (token && user) {
    // Si hay sesión activa en la pestaña, mostramos la app
    showApp();
  }
  // Si no hay token, se muestra el auth-section por defecto
});


// ============================================================
// EXPONEMOS FUNCIONES AL SCOPE GLOBAL
// ============================================================
// Como usamos ES6 modules (type="module"), las funciones no son
// globales. Las exponemos en window para que funcionen los onclick
// del HTML generado dinámicamente.
// ============================================================

window.navigateTo = navigateTo;
window.switchAuthTab = switchAuthTab;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleLogout = handleLogout;
window.closeModal = closeModal;

// Usuarios
window.openCreateUserModal = openCreateUserModal;
window.openEditUserModal = openEditUserModal;
window.handleSaveUser = handleSaveUser;
window.handleDeleteUser = handleDeleteUser;

// Productos
window.openCreateProductModal = openCreateProductModal;
window.openEditProductModal = openEditProductModal;
window.handleSaveProduct = handleSaveProduct;
window.handleDeleteProduct = handleDeleteProduct;

// Ventas
window.openCreateSaleModal = openCreateSaleModal;
window.openEditSaleModal = openEditSaleModal;
window.handleSaveSale = handleSaveSale;
window.handleDeleteSale = handleDeleteSale;
window.handleProductSelectChange = handleProductSelectChange;
window.calculateTotal = calculateTotal;
window.addProductRowToSaleModal = addProductRowToSaleModal;
window.removeProductRowFromSaleModal = removeProductRowFromSaleModal;
window.calculateSaleTotal = calculateSaleTotal;

