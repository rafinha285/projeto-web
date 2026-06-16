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

        return await response.json();
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
    const response = await fetch(`/api/destination/book/${id}`, {method: "POST"});
    if (!response.ok) {
        throw new Error(`Erro ao agendar o destino ${id}`);
    }
    const json = await response.json();
    console.log(json);
    return json
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
                <img src="${location.imageUrl}" alt="${location.name}" class="dest-img">
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
        const response = await fetch("/profile/user");
        if (!response.ok) return;
        const user = await response.json();
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