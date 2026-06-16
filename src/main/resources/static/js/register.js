// ── TOGGLE SENHA ──
function bindToggle(btnId, inputId) {
  const btn = document.getElementById(btnId);
  const input = document.getElementById(inputId);
  btn.addEventListener('click', () => {
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    btn.textContent = isPassword ? '🙈' : '👁';
  });
}
bindToggle('togglePw', 'password');
bindToggle('toggleConfirm', 'confirm');

// ── VALIDAÇÃO ──
function validateName(value) {
  if (!value.trim()) return 'Nome obrigatório.';
  if (value.trim().length < 3) return 'Nome muito curto.';
  return null;
}

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

function validateConfirm(value, password) {
  if (!value) return 'Confirmação obrigatória.';
  if (value !== password) return 'As senhas não coincidem.';
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

// ── LIMPA ERROS AO DIGITAR ──
['name', 'email', 'password', 'confirm'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    setFieldError(`field-${id}`, `error-${id}`, null);
  });
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
const form = document.getElementById('registerForm');
const btnRegister = document.getElementById('btnRegister');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name     = document.getElementById('name').value;
  const email    = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirm  = document.getElementById('confirm').value;

  const nameError     = validateName(name);
  const emailError    = validateEmail(email);
  const passwordError = validatePassword(password);
  const confirmError  = validateConfirm(confirm, password);

  setFieldError('field-name',     'error-name',     nameError);
  setFieldError('field-email',    'error-email',     emailError);
  setFieldError('field-password', 'error-password',  passwordError);
  setFieldError('field-confirm',  'error-confirm',   confirmError);

  if (nameError || emailError || passwordError || confirmError) return;

  // Loading state
  btnRegister.classList.add('loading');
  btnRegister.disabled = true;

  const res = await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });

  btnRegister.classList.remove('loading');
  btnRegister.disabled = false;

  if (res.status === 201) {
    showToast('Conta criada! Redirecionando...');
    setTimeout(() => window.location.href = '/login', 1500);
  } else if (res.status === 409) {
    setFieldError('field-email', 'error-email', 'Este e-mail já está cadastrado.');
  } else {
    showToast('Erro ao cadastrar. Tente novamente.');
  }
});