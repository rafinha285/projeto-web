// ── GERENCIAMENTO DE ABAS (via sidebar) ──
const navTabs = document.querySelectorAll('.nav-tab');
const tabPanels = document.querySelectorAll('.tab-panel');

let viagensLoaded = false;
let favoritosLoaded = false;

navTabs.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const target = btn.dataset.tab;

    // Remove 'active' de todos os nav-tabs e painéis
    navTabs.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));

    // Ativa o item clicado e o painel correspondente
    btn.classList.add('active');
    const panel = document.getElementById(`tab-${target}`);
    if (panel) panel.classList.add('active');

    // Atualiza o título do header conforme a aba
    const headerTitle = document.querySelector('.page-header-mini h1');
    if (headerTitle) {
      const titles = {
        dados: 'Meu <em>Perfil</em>',
        viagens: 'Minhas <em>Viagens</em>',
        favoritos: 'Meus <em>Favoritos</em>',
        pagamento: '<em>Pagamentos</em>',
        seguranca: '<em>Segurança</em>'
      };
      headerTitle.innerHTML = titles[target] || 'Meu <em>Perfil</em>';
    }

    // Carrega viagens na primeira troca
    if (target === 'viagens' && !viagensLoaded) {
      viagensLoaded = true;
      loadMinhasViagens();
    }

    // Carrega favoritos na primeira troca
    if (target === 'favoritos' && !favoritosLoaded) {
      favoritosLoaded = true;
      loadMeusFavoritos();
    }

    // Fecha sidebar no mobile
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
  });
});

// ── MINHAS VIAGENS ──
async function loadMinhasViagens() {
  const loadingEl = document.getElementById('viagensLoading');
  const emptyEl = document.getElementById('viagensEmpty');
  const listEl = document.getElementById('viagensList');

  loadingEl.style.display = 'flex';
  emptyEl.style.display = 'none';
  listEl.style.display = 'none';

  try {
    const res = await fetch('/api/profile/bookings', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) {
      if (res.status === 401) {
        showToast('❌ Sessão expirada. Faça login novamente.');
        return;
      }
      throw new Error(`HTTP ${res.status}`);
    }

    const result = await res.json();
    const bookings = result.dados || result;
    console.log(bookings);

    loadingEl.style.display = 'none';

    if (!bookings || bookings.length === 0) {
      emptyEl.style.display = 'flex';
      return;
    }

    // O backend já retorna as informações completas do location dentro do BookDTO
    const bookingsComLocalizacao = bookings.map(booking => {
        return { ...booking, loc: booking.location || {} };
    });

    listEl.style.display = 'grid';

    listEl.innerHTML = bookingsComLocalizacao.map((item, i) => {
      const booking = item;
      const loc = item.loc;

      const price = loc.price
          ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(loc.price)
          : '—';

      const bookedAt = booking.bookedAt
          ? new Date(booking.bookedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
          : '—';

      return `
        <div class="viagem-card card" style="animation-delay: ${i * 0.05}s">
          <div class="viagem-img-wrap">
            <img src="${loc.imageUrl || ''}" alt="${loc.name || 'Destino'}" onerror="this.style.display='none'">
            <span class="viagem-badge">${loc.continent || '🌍'}</span>
          </div>
          <div class="viagem-info">
            <h3 class="viagem-name">${loc.name || 'Destino'}${loc.country ? ', ' + loc.country : ''}</h3>
            <p class="viagem-desc">${loc.description ? loc.description.substring(0, 80) + '...' : ''}</p>
            <div class="viagem-meta">
              <span class="viagem-date">📅 ${bookedAt}</span>
              <span class="viagem-price">${price}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

  } catch (e) {
    console.error('Erro ao carregar viagens:', e);
    loadingEl.style.display = 'none';
    listEl.style.display = 'none';
    emptyEl.style.display = 'flex';
    emptyEl.querySelector('h3').textContent = 'Erro ao carregar';
    emptyEl.querySelector('p').textContent = 'Não foi possível carregar suas viagens. Tente novamente.';
  }
}

// ── SISTEMA DE TOAST (FEEDBACK) ──
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ── SALVAMENTO ──
const btnSave = document.getElementById('btnSave');
if (btnSave) {
  btnSave.addEventListener('click', async () => {
    btnSave.textContent = '⏳ Salvando...';
    btnSave.disabled = true;
    btnSave.style.opacity = '0.7';
    let birthdateRaw = document.getElementById('inputBirthdate')?.value || "";
    let formattedDate = birthdateRaw;
    if (birthdateRaw.includes('/')) {
      const parts = birthdateRaw.split('/');
      if (parts.length === 3) {
        formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    const dadosAtuais = {
      name: document.getElementById('inputName')?.value,
      dataNascimento: formattedDate,
      nacionalidade: document.getElementById('inputNationality')?.value,
      numTelefone: document.getElementById('inputPhone')?.value,
      cidade: document.getElementById('inputCity')?.value,
      bio: document.getElementById('inputBio')?.value,
      assento: document.getElementById('inputAssento')?.value,
      comida: document.getElementById('inputComida')?.value,
      classe: document.getElementById('inputClasse')?.value,
      moeda: document.getElementById('inputMoeda')?.value
    };

    try {
      const response = await fetch("/api/profile/user", {
        method: "PATCH",
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAtuais)
      });

      if (response.status === 200) {
        showToast('✅ Perfil atualizado com sucesso!');
      } else if (response.status === 401) {
        showToast('❌ Não autorizado. Faça login novamente.');
        setTimeout(() => window.location.href = '/login', 1500);
      } else if (response.status === 404) {
        showToast('❌ Usuário não encontrado.');
      } else {
        showToast('❌ Erro ao atualizar perfil.');
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      showToast('❌ Erro de rede ao salvar perfil.');
    } finally {
      btnSave.textContent = '💾 Salvar Alterações';
      btnSave.disabled = false;
      btnSave.style.opacity = '1';
    }
  });
}

// ── OUTRAS INTERAÇÕES ──
const btnAvatar = document.getElementById('btnAvatar');
if (btnAvatar) {
  btnAvatar.addEventListener('click', () => {
    showToast('📸 Função de upload de foto em breve!');
  });
}

const btnOutline = document.querySelector('.btn-outline');
if (btnOutline) {
  btnOutline.addEventListener('click', () => {
    showToast('Alterações descartadas.');
  });
}

// ── MENU MOBILE (HAMBURGER / SIDEBAR TOGGLE) ──
const hamburgerBtn = document.getElementById('hamburgerBtn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

function openSidebar() {
  if (!sidebar || !sidebarOverlay) return;
  sidebar.classList.add('open');
  sidebarOverlay.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  if (!sidebar || !sidebarOverlay) return;
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('visible');
  document.body.style.overflow = '';
}

if (hamburgerBtn) {
  hamburgerBtn.addEventListener('click', () => {
    if (sidebar.classList.contains('open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });
}

if (sidebarOverlay) {
  sidebarOverlay.addEventListener('click', closeSidebar);
}

// Fecha o sidebar ao clicar em um item de navegação (no mobile)
if (sidebar) {
  sidebar.querySelectorAll('.nav-item:not(.nav-tab)').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeSidebar();
      }
    });
  });
}

// Fecha o sidebar ao redimensionar para desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    closeSidebar();
  }
});

// ── LOADING USER DATA FROM BACKEND ──
document.addEventListener('DOMContentLoaded', async function initProfile() {
  try {
    const response = await fetch('/api/profile/user');

    if (response.ok) {
      let result = await response.json();
      let userData = result.dados || result;

      if (userData.name) {
        const heroName = document.getElementById('heroName');
        if (heroName) heroName.textContent = userData.name;

        const inputName = document.getElementById('inputName');
        if (inputName) inputName.value = userData.name;

        const nameParts = userData.name.trim().split(' ');
        let initials = '?';
        if (nameParts.length >= 2) {
          initials = nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0);
        } else if (nameParts.length === 1 && nameParts[0].length > 0) {
          initials = nameParts[0].substring(0, 2);
        }
        initials = initials.toUpperCase();

        const topbarAvatar = document.querySelector('.topbar-avatar');
        const heroInitials = document.getElementById('heroInitials');
        if (topbarAvatar) topbarAvatar.textContent = initials;
        if (heroInitials) heroInitials.textContent = initials;
      }

      if (userData.email) {
        const heroEmail = document.getElementById('heroEmail');
        if (heroEmail) heroEmail.textContent = userData.email;
      }

      if (userData.dataNascimento) {
        const birthdateInput = document.getElementById('inputBirthdate');
        if (birthdateInput) {
          if (userData.dataNascimento.includes('-')) {
            const parts = userData.dataNascimento.split('-');
            if (parts.length === 3) {
              birthdateInput.value = `${parts[2]}/${parts[1]}/${parts[0]}`;
            } else {
              birthdateInput.value = userData.dataNascimento;
            }
          } else {
            birthdateInput.value = userData.dataNascimento;
          }
        }
      }

      if (userData.nacionalidade) {
        const natInput = document.getElementById('inputNationality');
        if (natInput) natInput.value = userData.nacionalidade;
      }
      if (userData.numTelefone) {
        const phoneInput = document.getElementById('inputPhone');
        if (phoneInput) phoneInput.value = userData.numTelefone;
      }
      if (userData.cidade) {
        const cityInput = document.getElementById('inputCity');
        if (cityInput) cityInput.value = userData.cidade;
      }
      if (userData.bio) {
        const bioInput = document.getElementById('inputBio');
        if (bioInput) bioInput.value = userData.bio;
      }
      if (userData.assento) {
        const assentoInput = document.getElementById('inputAssento');
        if (assentoInput) assentoInput.value = userData.assento;
      }
      if (userData.comida) {
        const comidaInput = document.getElementById('inputComida');
        if (comidaInput) comidaInput.value = userData.comida;
      }
      if (userData.classe) {
        const classeInput = document.getElementById('inputClasse');
        if (classeInput) classeInput.value = userData.classe;
      }
      if (userData.moeda) {
        const moedaInput = document.getElementById('inputMoeda');
        if (moedaInput) moedaInput.value = userData.moeda;
      }

    } else {
      console.warn('Endpoint de usuário retornou erro:', response.status);
      if (response.status === 401 || response.status === 403 || response.status === 302) {
        window.location.href = '/login';
      }
    }
  } catch (err) {
    console.error('Erro de rede ao buscar dados do usuário:', err);
  }
});

// ── MEUS FAVORITOS ──
async function loadMeusFavoritos() {
  const loadingEl = document.getElementById('favoritosLoading');
  const emptyEl = document.getElementById('favoritosEmpty');
  const listEl = document.getElementById('favoritosList');

  loadingEl.style.display = 'flex';
  emptyEl.style.display = 'none';
  listEl.style.display = 'none';

  try {
    const res = await fetch('/api/profile/favorites', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) {
      if (res.status === 401) {
        showToast('❌ Sessão expirada. Faça login novamente.');
        return;
      }
      throw new Error(`HTTP ${res.status}`);
    }

    const result = await res.json();
    const favorites = result.dados || result;

    loadingEl.style.display = 'none';

    if (!favorites || favorites.length === 0) {
      emptyEl.style.display = 'flex';
      return;
    }

    // Busca localizações em paralelo
    const favsComLocalizacao = await Promise.all(
        favorites.map(async (fav) => {
          try {
            const locRes = await fetch(`/api/location/${fav.locationId}`);
            if (locRes.ok) {
              const locJson = await locRes.json();
              const loc = locJson.dados || locJson.dadosArray?.[0] || locJson;
              return { ...fav, loc };
            }
            return { ...fav, loc: {} };
          } catch (err) {
            console.error(`Erro ao buscar localização ${fav.locationId}:`, err);
            return { ...fav, loc: {} };
          }
        })
    );

    listEl.style.display = 'grid';

    listEl.innerHTML = favsComLocalizacao.map((item, i) => {
      const loc = item.loc;

      const price = loc.price
          ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(loc.price)
          : '—';

      return `
        <div class="viagem-card card" style="animation-delay: ${i * 0.05}s" data-fav-id="${item.id || item.locationId}">
          <div class="viagem-img-wrap">
            <img src="${loc.imageUrl || ''}" alt="${loc.name || 'Destino'}" onerror="this.style.display='none'">
            <span class="viagem-badge">${loc.continent || '🌍'}</span>
            <button class="fav-remove-btn" onclick="removeFavorito(this, ${fav.locationId})" title="Remover dos favoritos">✕</button>
          </div>
          <div class="viagem-info">
            <h3 class="viagem-name">${loc.name || 'Destino'}${loc.country ? ', ' + loc.country : ''}</h3>
            <p class="viagem-desc">${loc.description ? loc.description.substring(0, 80) + '...' : ''}</p>
            <div class="viagem-meta">
              <span class="viagem-date">💛 Favoritado</span>
              <span class="viagem-price">${price}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

  } catch (e) {
    console.error('Erro ao carregar favoritos:', e);
    loadingEl.style.display = 'none';
    listEl.style.display = 'none';
    emptyEl.style.display = 'flex';
    emptyEl.querySelector('h3').textContent = 'Erro ao carregar';
    emptyEl.querySelector('p').textContent = 'Não foi possível carregar seus favoritos. Tente novamente.';
  }
}

function removeFavorito(btn, locationId) {
  const card = btn.closest('.viagem-card');
  if (!card) return;

  fetch(`/api/profile/favorites/${locationId}`, { method: 'DELETE' }).catch(console.error);

  card.style.transform = 'scale(0.9)';
  card.style.opacity = '0';
  setTimeout(() => {
    card.remove();
    showToast('💔 Removido dos favoritos.');
    // Se não sobrou nenhum card, mostra o empty state
    const listEl = document.getElementById('favoritosList');
    if (listEl && listEl.children.length === 0) {
      listEl.style.display = 'none';
      const emptyEl = document.getElementById('favoritosEmpty');
      if (emptyEl) emptyEl.style.display = 'flex';
    }
  }, 250);
}

// ── PAGAMENTO — ADICIONAR CARTÃO ──
const btnAddCard = document.getElementById('btnAddCard');
const addCardForm = document.getElementById('addCardForm');
const btnCancelCard = document.getElementById('btnCancelCard');
const btnSaveCard = document.getElementById('btnSaveCard');

if (btnAddCard && addCardForm) {
  btnAddCard.addEventListener('click', () => {
    addCardForm.style.display = 'block';
    addCardForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    btnAddCard.disabled = true;
    btnAddCard.style.opacity = '0.5';
  });
}

if (btnCancelCard && addCardForm) {
  btnCancelCard.addEventListener('click', () => {
    addCardForm.style.display = 'none';
    // Limpa campos
    ['inputCardName', 'inputCardNumber', 'inputCardExpiry', 'inputCardCvv'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    if (btnAddCard) {
      btnAddCard.disabled = false;
      btnAddCard.style.opacity = '1';
    }
  });
}

if (btnSaveCard) {
  btnSaveCard.addEventListener('click', () => {
    const name = document.getElementById('inputCardName')?.value;
    const number = document.getElementById('inputCardNumber')?.value;
    const expiry = document.getElementById('inputCardExpiry')?.value;
    const cvv = document.getElementById('inputCardCvv')?.value;

    if (!name || !number || !expiry || !cvv) {
      showToast('❌ Preencha todos os campos do cartão.');
      return;
    }
    if (number.replace(/\s/g, '').length < 13) {
      showToast('❌ Número do cartão inválido.');
      return;
    }

    showToast('✅ Cartão adicionado com sucesso!');
    if (addCardForm) addCardForm.style.display = 'none';
    if (btnAddCard) {
      btnAddCard.disabled = false;
      btnAddCard.style.opacity = '1';
    }

    // Adiciona visualmente o novo cartão na lista
    const last4 = number.replace(/\s/g, '').slice(-4);
    const cardsList = document.getElementById('paymentCardsList');
    if (cardsList) {
      const newCard = document.createElement('div');
      newCard.className = 'payment-card-item';
      newCard.style.animation = 'fadeInUp 0.3s ease both';
      newCard.innerHTML = `
        <div class="card-brand visa">CARD</div>
        <div class="card-details">
          <span class="card-number">•••• •••• •••• ${last4}</span>
          <span class="card-expiry">Expira ${expiry}</span>
        </div>
        <button class="card-remove-btn" title="Remover">✕</button>
      `;
      cardsList.appendChild(newCard);
      newCard.querySelector('.card-remove-btn').addEventListener('click', function() {
        removePaymentCard(this);
      });
    }

    // Limpa campos
    ['inputCardName', 'inputCardNumber', 'inputCardExpiry', 'inputCardCvv'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  });
}

// Remove cartão de pagamento
function removePaymentCard(btn) {
  const card = btn.closest('.payment-card-item');
  if (!card) return;
  card.style.transform = 'scale(0.95)';
  card.style.opacity = '0';
  card.style.transition = 'all 0.25s ease';
  setTimeout(() => {
    card.remove();
    showToast('🗑️ Cartão removido.');
  }, 250);
}

// Attach remove handler to existing cards
document.querySelectorAll('.card-remove-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    removePaymentCard(this);
  });
});

// Salvar endereço de cobrança
const btnSaveBilling = document.getElementById('btnSaveBilling');
if (btnSaveBilling) {
  btnSaveBilling.addEventListener('click', () => {
    showToast('✅ Endereço de cobrança salvo!');
  });
}

// ── SEGURANÇA — ALTERAR SENHA ──
const inputNewPass = document.getElementById('inputNewPass');
const passwordStrength = document.getElementById('passwordStrength');

if (inputNewPass && passwordStrength) {
  inputNewPass.addEventListener('input', () => {
    const val = inputNewPass.value;
    let strength = 0;
    if (val.length >= 8) strength++;
    if (/[A-Z]/.test(val)) strength++;
    if (/[0-9]/.test(val)) strength++;
    if (/[^A-Za-z0-9]/.test(val)) strength++;

    const colors = ['#e74c3c', '#e67e22', '#f1c40f', '#27ae60'];
    const widths = ['25%', '50%', '75%', '100%'];

    if (val.length === 0) {
      passwordStrength.innerHTML = '';
    } else {
      passwordStrength.innerHTML = `<div class="strength-fill" style="width: ${widths[strength - 1] || '10%'}; background: ${colors[strength - 1] || '#e74c3c'};"></div>`;
    }
  });
}

const btnChangePass = document.getElementById('btnChangePass');
if (btnChangePass) {
  btnChangePass.addEventListener('click', () => {
    const current = document.getElementById('inputCurrentPass')?.value;
    const newPass = document.getElementById('inputNewPass')?.value;
    const confirm = document.getElementById('inputConfirmPass')?.value;

    if (!current || !newPass || !confirm) {
      showToast('❌ Preencha todos os campos de senha.');
      return;
    }
    if (newPass.length < 8) {
      showToast('❌ A nova senha deve ter no mínimo 8 caracteres.');
      return;
    }
    if (newPass !== confirm) {
      showToast('❌ As senhas não coincidem.');
      return;
    }

    btnChangePass.textContent = '⏳ Alterando...';
    btnChangePass.disabled = true;
    setTimeout(() => {
      showToast('✅ Senha alterada com sucesso!');
      btnChangePass.textContent = 'Alterar Senha';
      btnChangePass.disabled = false;
      ['inputCurrentPass', 'inputNewPass', 'inputConfirmPass'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      if (passwordStrength) passwordStrength.innerHTML = '';
    }, 1200);
  });
}

// ── SEGURANÇA — 2FA TOGGLES ──
['toggle2FA', 'toggleSMS', 'toggleEmail'].forEach(id => {
  const toggle = document.getElementById(id);
  if (toggle) {
    toggle.addEventListener('change', () => {
      const labels = {
        toggle2FA: 'Autenticação via App',
        toggleSMS: 'Verificação por SMS',
        toggleEmail: 'Verificação por E-mail'
      };
      const state = toggle.checked ? 'ativada' : 'desativada';
      showToast(`🔒 ${labels[id]} ${state}.`);
    });
  }
});

// ── SEGURANÇA — SESSÕES ──
document.querySelectorAll('.session-revoke').forEach(btn => {
  btn.addEventListener('click', function() {
    const item = this.closest('.session-item');
    if (!item) return;
    item.style.transform = 'scale(0.95)';
    item.style.opacity = '0';
    item.style.transition = 'all 0.25s ease';
    setTimeout(() => {
      item.remove();
      showToast('🔓 Sessão encerrada.');
    }, 250);
  });
});

const btnRevokeAll = document.getElementById('btnRevokeAll');
if (btnRevokeAll) {
  btnRevokeAll.addEventListener('click', () => {
    const items = document.querySelectorAll('.session-item:not(.current)');
    if (items.length === 0) {
      showToast('ℹ️ Nenhuma outra sessão ativa.');
      return;
    }
    items.forEach((item, i) => {
      setTimeout(() => {
        item.style.transform = 'scale(0.95)';
        item.style.opacity = '0';
        item.style.transition = 'all 0.25s ease';
        setTimeout(() => item.remove(), 250);
      }, i * 100);
    });
    setTimeout(() => {
      showToast('🔓 Todas as outras sessões encerradas.');
    }, items.length * 100);
  });
}

// ── SEGURANÇA — EXCLUIR CONTA ──
const btnDeleteAccount = document.getElementById('btnDeleteAccount');
if (btnDeleteAccount) {
  btnDeleteAccount.addEventListener('click', () => {
    const confirmed = window.confirm('⚠️ Tem certeza que deseja excluir sua conta?\n\nEsta ação é PERMANENTE e não pode ser desfeita. Todos os seus dados, viagens e favoritos serão removidos.');
    if (confirmed) {
      showToast('🗑️ Solicitação de exclusão enviada.');
    }
  });
}
