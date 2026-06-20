function initLocations() {
    const form = document.getElementById('destinationForm');
    if (form) {
        loadLocations();
        form.addEventListener('submit', handleAddDestination);
    }
}

async function loadLocations() {
    const listEl = document.getElementById('locationsList');
    const loadEl = document.getElementById('loadingState');

    listEl.innerHTML = '';
    loadEl.style.display = 'block';

    try {
        const res = await fetch('/api/locations', {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (!res.ok) {
            if(res.status === 401 || res.status === 403) {
                window.location.href = '/login';
                return;
            }
            throw new Error('Falha ao carregar');
        }

        const data = (await res.json()).dados;
        
        loadEl.style.display = 'none';

        if (data.length === 0) {
            listEl.innerHTML = '<p style="color:var(--muted); text-align:center; padding: 2rem 0;">Nenhum destino cadastrado ainda.</p>';
            return;
        }

        data.forEach(loc => {
            const row = document.createElement('div');
            row.className = 'loc-item';
            row.innerHTML = `
                <div class="loc-img-box">
                    <img src="${loc.imageUrl}" alt="${loc.name}" onerror="this.style.display='none'">
                </div>
                <div class="loc-details">
                    <h3>${loc.name}, ${loc.country}</h3>
                    <p>${loc.continent} — ${loc.description?.substring(0,60)}...</p>
                </div>
                <div class="loc-actions">
                    <span class="loc-price">${new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'}).format(loc.price)}</span>
                    <button class="btn-delete" onclick="deleteLocation(${loc.id})">Excluir</button>
                </div>
            `;
            listEl.appendChild(row);
        });

    } catch (e) {
        console.error(e);
        loadEl.style.display = 'none';
        listEl.innerHTML = '<p style="color:var(--error); text-align:center;">Erro ao carregar destinos.</p>';
    }
}

async function handleAddDestination(e) {
    e.preventDefault();

    const btn = document.getElementById('btnSubmitDest');
    btn.classList.add('loading');

    const payload = {
        name: document.getElementById('dest-name').value,
        country: document.getElementById('dest-country').value,
        continent: document.getElementById('dest-continent').value,
        price: parseFloat(document.getElementById('dest-price').value),
        imageUrl: document.getElementById('dest-imageUrl').value,
        description: document.getElementById('dest-desc').value,
        startDate: document.getElementById('dest-start').value || null,
        endDate: document.getElementById('dest-end').value || null,
        latitude: document.getElementById('dest-lat').value ? parseFloat(document.getElementById('dest-lat').value) : null,
        longitude: document.getElementById('dest-lng').value ? parseFloat(document.getElementById('dest-lng').value) : null
    };

    try {
        const res = await fetch('/api/locations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            throw new Error(`Erro: ${res.status}`);
        }

        showToast('Destino cadastrado com sucesso!');
        document.getElementById('destinationForm').reset();
        
        // Reload list
        loadLocations();
    } catch (e) {
        console.error(e);
        showToast('Falha ao cadastrar o destino. Tente novamente.');
    } finally {
        btn.classList.remove('loading');
    }
}

async function deleteLocation(id) {
    if (!confirm('Deseja realmente remover este destino da plataforma?')) return;

    try {
        const res = await fetch(`/api/locations?id=${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) {
            throw new Error(`Erro: ${res.status}`);
        }
        
        showToast('Destino excluído.');
        loadLocations();
    } catch (e) {
        console.error(e);
        showToast('Erro ao excluir destino.');
    }
}

// showToast is provided by gerenciamento.js when embedded in the panel
