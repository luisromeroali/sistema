/**
 * SISTEMA WEB PARA LA GESTIÓN ADMINISTRATIVA - REFRIGERACIÓN RUFO 1, C.A.
 * Módulo: Controlador de Interfaz y Autenticación (Login)
 * Conectado a la Entidad USUARIOS (id_usuario, nombre_completo, usuario, contrasena, rol)
 */

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'rufo_db_relacional_v2';

  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const eyeOpenIcon = document.getElementById('eyeOpenIcon');
  const eyeClosedIcon = document.getElementById('eyeClosedIcon');
  const submitBtn = document.getElementById('submitBtn');
  const submitBtnText = document.getElementById('submitBtnText');
  const feedbackAlert = document.getElementById('feedbackAlert');
  const feedbackMessage = document.getElementById('feedbackMessage');

  // Modal de Seguridad (Cambio de Contraseña restringido al Administrador)
  const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
  const securityModalBackdrop = document.getElementById('securityModalBackdrop');
  const closeSecurityModalBtn = document.getElementById('closeSecurityModalBtn');

  function getUsuariosList() {
    const defaultUsuarios = [
      {
        id_usuario: 1,
        nombre_completo: 'Administrador General',
        usuario: 'admin',
        contrasena: 'rufo2026',
        rol: 'administrador'
      },
      {
        id_usuario: 2,
        nombre_completo: 'Operador de Ventas',
        usuario: 'empleado',
        contrasena: 'ventas2026',
        rol: 'empleado'
      }
    ];

    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && Array.isArray(saved.usuarios) && saved.usuarios.length > 0) {
        return saved.usuarios;
      }
    } catch (e) {
      // Usar lista por defecto si no existe en localStorage
    }
    return defaultUsuarios;
  }

  /**
   * Alternar visibilidad de la contraseña
   */
  togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    eyeOpenIcon.style.display = isPassword ? 'none' : 'block';
    eyeClosedIcon.style.display = isPassword ? 'block' : 'none';
    togglePasswordBtn.setAttribute(
      'aria-label',
      isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
    );
  });

  function showFeedback(type, message) {
    feedbackAlert.className = `feedback-alert show ${type}`;
    feedbackMessage.innerHTML = message;
  }

  function hideFeedback() {
    feedbackAlert.className = 'feedback-alert';
    usernameInput.classList.remove('input-error');
    passwordInput.classList.remove('input-error');
  }

  usernameInput.addEventListener('input', hideFeedback);
  passwordInput.addEventListener('input', hideFeedback);

  /**
   * Manejo del envío del formulario de Login validando contra la entidad USUARIOS
   */
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    hideFeedback();

    const username = usernameInput.value.trim().toLowerCase();
    const password = passwordInput.value.trim();

    if (!username) {
      usernameInput.classList.add('input-error');
      usernameInput.focus();
      showFeedback('error', 'Por favor, ingrese su nombre de usuario.');
      return;
    }

    if (!password) {
      passwordInput.classList.add('input-error');
      passwordInput.focus();
      showFeedback('error', 'Por favor, ingrese su contraseña.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtnText.textContent = 'Verificando...';

    setTimeout(() => {
      const usuarios = getUsuariosList();
      const account = usuarios.find(
        (u) => u.usuario.toLowerCase() === username && u.contrasena === password
      );

      if (account) {
        showFeedback(
          'success',
          `<strong>Bienvenido, ${account.nombre_completo}:</strong> Accediendo con rol <em>${account.rol}</em>...`
        );
        setTimeout(() => {
          window.location.href = 'admin.html';
        }, 500);
      } else {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtnText.textContent = 'Ingresar al Sistema';
        passwordInput.classList.add('input-error');
        showFeedback('error', 'Usuario o contraseña incorrectos.');
      }
    }, 450);
  });

  /**
   * Modal de Política de Seguridad
   */
  function openSecurityModal() {
    securityModalBackdrop.classList.add('open');
    securityModalBackdrop.setAttribute('aria-hidden', 'false');
    closeSecurityModalBtn.focus();
  }

  function closeSecurityModal() {
    securityModalBackdrop.classList.remove('open');
    securityModalBackdrop.setAttribute('aria-hidden', 'true');
    forgotPasswordBtn.focus();
  }

  forgotPasswordBtn.addEventListener('click', openSecurityModal);
  closeSecurityModalBtn.addEventListener('click', closeSecurityModal);

  securityModalBackdrop.addEventListener('click', (e) => {
    if (e.target === securityModalBackdrop) {
      closeSecurityModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && securityModalBackdrop.classList.contains('open')) {
      closeSecurityModal();
    }
  });
});
