let allLocations = [];
let currentFilter = 'all';
let currentSort   = 'name';

const grid        = () => document.getElementById('destinationsGrid');
const emptyEl     = () => document.getElementById('emptyState');
const loadingEl   = () => document.getElementById('loadingState');
const countEl     = () => document.getElementById('resultsCount');
const titleEl     = () => document.getElementById('resultsTitle');

// async function getLocations() {
//     try {
//         const res = await fetch('/locations', {method: 'POST'});
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         return await res.json();
//     } catch (err) {
//         console.error('Erro ao buscar destinos:', err);
//         return [];
//     }
// }

async function search() {
    const name      = document.getElementById('search-name').value;
    const startDate = document.getElementById('search-start-date').value;
    const endDate   = document.getElementById('search-end-date').value;

    const btn = document.getElementById('btnSearch');
    btn.classList.add('loading');

    showLoading(true);

    try {
        const url = new URL('/api/location/search', window.location.origin);
        url.searchParams.append('name', name);
        url.searchParams.append('startDate', startDate);
        url.searchParams.append('endDate', endDate);

        const res = await fetch(url.toString(), { method: 'GET' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const result = await res.json()

        if (result.status) {
            allLocations = result.dados; // AQUI: pega apenas a lista de destinos
        } else {
            console.error('Erro do servidor:', result.mensagem);
            allLocations = [];
        }

        console.log('Destinos carregados:', allLocations);

        document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        document.querySelector('.chip[data-continent="all"]').classList.add('active');

        titleEl().textContent = name
            ? `Resultados para "${name}"`
            : 'Todos os Destinos';

        applyFilterAndSort();
    } catch (err) {
        console.error(err);
        allLocations = [];
        applyFilterAndSort();
    } finally {
        btn.classList.remove('loading');
    }
}

function bookDestination(id) {
    window.location.href = `/reserve?id=${id}`;
}

function applyFilterAndSort() {
    let filtered = [...allLocations];

    if (currentFilter !== 'all') {
        filtered = filtered.filter(l =>
            l.continent && l.continent.toLowerCase() === currentFilter.toLowerCase()
        );
    }

    switch (currentSort) {
        case 'name':
            filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            break;
        case 'name-desc':
            filtered.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
            break;
        case 'price':
            filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
            break;
        case 'price-desc':
            filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
            break;
    }

    renderDestinations(filtered);
}

function showLoading(show) {
    loadingEl().style.display = show ? 'grid' : 'none';
    grid().style.display      = show ? 'none' : 'grid';
    emptyEl().style.display   = 'none';
}

function renderDestinations(locations) {
    showLoading(false);
    const container = grid();
    container.innerHTML = '';

    if (locations.length === 0) {
        emptyEl().style.display  = 'flex';
        container.style.display  = 'none';
        countEl().textContent    = '';
        return;
    }

    emptyEl().style.display = 'none';
    container.style.display = 'grid';

    const suffix = locations.length === 1 ? 'destino encontrado' : 'destinos encontrados';
    countEl().textContent = `${locations.length} ${suffix}`;

    locations.forEach((loc, i) => {
        const card = document.createElement('div');
        card.className = 'dest-card';
        card.style.animationDelay = `${i * 0.08}s`;

        card.innerHTML = `
      <div class="dest-img-wrap">
        <img src="${loc.imageUrl || ''}" alt="${loc.name || 'Destino'}" class="dest-img"
             onerror="this.style.background='linear-gradient(135deg,#132236,#1a3050)'; this.style.objectFit='none';">
        <button class="fav-add-btn" onclick="toggleFavorite(this, ${loc.id})" title="Favoritar">🤍</button>
      </div>
      <div class="dest-info">
        <span class="dest-tag">${loc.continent || '🌍'}</span>
        <h3>${loc.name || 'Destino'}${loc.country ? ', ' + loc.country : ''}</h3>
        <p>${loc.description || 'Descubra este destino incrível.'}</p>
        <div class="dest-footer">
          <span class="price">A partir de <strong>${formatPrice(loc.price)}</strong></span>
          <button class="btn-book" onclick="bookDestination('${loc.id}')">Reservar</button>
        </div>
      </div>
    `;

        container.appendChild(card);
    });
}

function formatPrice(value) {
    if (!value && value !== 0) return '—';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
    }).format(value);
}

function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        toast.style.cssText = `
      position:fixed; bottom:28px; left:50%;
      transform:translateX(-50%) translateY(20px);
      background:#1e3a52; border:1px solid var(--gold);
      border-radius:10px; padding:12px 24px;
      font-size:0.88rem; color:#f5f0e8;
      opacity:0; transition:opacity .3s, transform .3s;
      z-index:999; white-space:nowrap;
    `;
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        toast.classList.remove('show');
    }, 3000);
}

function setupFilters() {
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentFilter = chip.dataset.continent;
            applyFilterAndSort();
        });
    });

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            currentSort = sortSelect.value;
            applyFilterAndSort();
        });
    }
}

function setupSearchEnter() {
    const inputs = document.querySelectorAll('.search-field input');
    inputs.forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                search();
            }
        });
    });
}

function parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const name      = params.get('name');
    const startDate = params.get('startDate');
    const endDate   = params.get('endDate');

    if (name)      document.getElementById('search-name').value = name;
    if (startDate) document.getElementById('search-start-date').value = startDate;
    if (endDate)   document.getElementById('search-end-date').value = endDate;

    return !!(name || startDate || endDate);
}

async function init() {
    setupFilters();
    setupSearchEnter();

    await search();
}

document.getElementById('btnSearch').addEventListener('click', search);
document.addEventListener('DOMContentLoaded', init);

async function toggleFavorite(btn, locationId) {
    const isFavorited = btn.textContent === '❤️';
    const method = isFavorited ? 'DELETE' : 'POST';
    try {
        const res = await fetch(`/api/profile/favorites/${locationId}`, { method });
        if (res.ok) {
            btn.textContent = isFavorited ? '🤍' : '❤️';
            showToast(isFavorited ? '💔 Removido dos favoritos.' : '❤️ Adicionado aos favoritos!', true);
        } else if(res.status === 401 || res.status === 403) {
            showToast('Você precisa estar logado! Redirecionando...');
            setTimeout(() => { window.location.href = "/login"; }, 1500);
        }
    } catch (e) {
        console.error(e);
    }
}
