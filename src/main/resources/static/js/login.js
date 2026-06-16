// ── TOGGLE SENHA ──
const togglePw = document.getElementById('togglePw');
const passwordInput = document.getElementById('password');

togglePw.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  togglePw.textContent = isPassword ? '🙈' : '👁';
});

// ── VALIDAÇÃO ──
function validateEmail(value) {
  if (!value.trim()) return 'E-mail obrigatório.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'E-mail inválido.';
  return null;
}

function validatePassword(value) {
  if (!value) return 'Senha obrigatória.';
  if (value.length < 6) return 'Mínimo de 6 caracteres.';
  return null;
}

function setFieldError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (message) {
    field.classList.add('has-error');
    error.textContent = message;
  } else {
    field.classList.remove('has-error');
    error.textContent = '';
  }
}

// Limpa erro ao digitar
document.getElementById('email').addEventListener('input', () => {
  setFieldError('field-email', 'error-email', null);
});

document.getElementById('password').addEventListener('input', () => {
  setFieldError('field-password', 'error-password', null);
});

// ── TOAST ──
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── SUBMIT ──
const form = document.getElementById('loginForm');
const btnLogin = document.getElementById('btnLogin');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  setFieldError('field-email', 'error-email', emailError);
  setFieldError('field-password', 'error-password', passwordError);

  if (emailError || passwordError) return;

  // Loading state
  btnLogin.classList.add('loading');
  btnLogin.disabled = true;

  const res = await fetch('login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ email, password })
  });

  btnLogin.classList.remove('loading');
  btnLogin.disabled = false;

  // Exemplo: login bem-sucedido
  // 

  if (res.status === 200) {
    showToast('Login bem-sucedido!');
    setTimeout(() => window.location.href = '/', 1500);
  } else if (res.status === 401) {
    showToast('Email ou senha incorretos. Tente novamente.');
  } else if (res.status === 404) {
    showToast('Usuário não encontrado.');
  } else {
    showToast('Erro no login. Verifique suas credenciais.');
  }
});