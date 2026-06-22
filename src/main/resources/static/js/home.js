/**
 * Type location
 * `Location = {
 *      id: number,
 *      name: string,
 *      country: string,
 *      continent: string,
 *      description: string,
 *      price: number
 * `
 * @returns {Promise<Location[]>}
 */

async function getLocations() {
    try {
        const response = await fetch("/api/locations");
        console.log(response);
        // Verifica se a resposta foi bem sucedida (status 200-299)
        if (!response.ok) {
            throw new Error(`Erro de HTTP! status: ${response.status}`);
        }

        let result = await response.json();
        return result.dados || result;
    } catch (error) {
        console.error("Erro ao buscar os destinos:", error);
        // Retorna um array vazio em caso de erro para não quebrar o layout
        return [];
    }
}

/**
 * Reserva destino pelo ID
 *
 * O ID do usuario fica no JWT
 * @param id
 * @returns {Promise<any>}
 */
async function bookDestination(id) {
    window.location.href = `/reserve?id=${id}`;
}

/**
 * Renderiza os cartões dos destinos vindos da API
 * @returns {Promise<void>}
 */
function renderDestinations(locations) {
    const container = document.querySelector(".destinations-grid");

    container.innerHTML = "";

    if(locations.length === 0){
        container.innerHTML = "<p>Nenhum destino encontrado</p>"
        return
    }

    locations.forEach(location => {
        const div = `
            <div class="dest-card">
                <div class="dest-img-wrap" style="position:relative;">
                    <img src="${location.imageUrl}" alt="${location.name}" class="dest-img">
                    <button class="fav-add-btn" onclick="toggleFavorite(this, ${location.id})" title="Favoritar">🤍</button>
                </div>
                <div class="dest-info">
                    <span class="dest-tag">${location.continent}</span>
                    <h3>${location.name}, ${location.country}</h3>
                    <p>${location.description}</p>
                    <div class="dest-footer">
                        <span class="price">A partir de <strong>${location.price}</strong></span>
                        <button class="btn-book" onclick="bookDestination('${location.id}')">Reservar</button>
                    </div>
                </div>
            </div>
        `
        container.insertAdjacentHTML("beforeend", div);
    })
}
async function checkAdmin() {
    try {
        const response = await fetch("/api/profile/user");
        if (!response.ok) return;
        let user = await response.json();
        user = user.dados || user;
        if (user.role === "admin") {
            const btn = document.getElementById("btn-admin");
            if (btn) btn.style.display = "";
        }
    } catch (e) {
        // silently ignore – non-admin or not logged in
    }
}

async function init(){
    const locations = await getLocations();
    renderDestinations(locations);
    checkAdmin();
}
init()
function getSearchPage(){
    const url = new URL("/search",window.location.origin)


    const nameValue = document.getElementById("search-name").value;
    const startValue = document.getElementById("search-start-date").value;
    const endValue = document.getElementById("search-end-date").value;

    url.searchParams.set("name", nameValue);
    url.searchParams.set("startDate", startValue);
    url.searchParams.set("endDate", endValue);

    window.location.href = url.toString();
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
        setTimeout(() => toast.classList.remove('show'), 300);
    }, 2500);
}

async function toggleFavorite(btn, locationId) {
    const isFavorited = btn.textContent === '❤️';
    const method = isFavorited ? 'DELETE' : 'POST';
    try {
        const res = await fetch(`/api/profile/favorites/${locationId}`, { method });
        if (res.ok) {
            btn.textContent = isFavorited ? '🤍' : '❤️';
        } else if (res.status === 401 || res.status === 403) {
            showToast('Você precisa estar logado! Redirecionando...');
            setTimeout(() => { window.location.href = "/login"; }, 1500);
        } else {
            console.error("Erro ao favoritar:", await res.text());
        }
    } catch (e) {
        console.error("Erro na requisição:", e);
    }
}