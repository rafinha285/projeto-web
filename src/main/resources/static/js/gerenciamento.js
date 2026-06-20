/**
 * Gerenciamento — Admin Panel
 *
 * Sections: Usuários (more coming soon)
 * Features: table with search, click-to-edit modal, PATCH to /admin/users
 */

let allUsers = [];
let currentSortField = null;
let currentSortDir = "asc";

// ═══════════════════════════════════════
// ACCESS CHECK
// ═══════════════════════════════════════

async function checkAdminAccess() {
    try {
        const response = await fetch("/api/profile/user");
        if (!response.ok) { showAccessDenied(); return false; }
        let user = await response.json();
        user = user.dados || user;
        if (user.role !== "admin") { window.location.replace('/'); }
        return true;
    } catch (e) {
        window.location.replace('/')
        return false;
    }
}

// function showAccessDenied() {
//     document.querySelector(".panel-layout").innerHTML = `
//         <div class="access-denied">
//             <div class="denied-icon">🔒</div>
//             <h2>Acesso Negado</h2>
//             <p>Você não tem permissão para acessar esta página.</p>
//             <a href="/" class="btn-back">← Voltar ao Início</a>
//         </div>
//     `;
// }

// ═══════════════════════════════════════
// SIDEBAR NAVIGATION
// ═══════════════════════════════════════

function setupSidebar() {
    document.querySelectorAll(".panel-nav-item").forEach(btn => {
        btn.addEventListener("click", () => {
            if (btn.disabled) return;

            document.querySelectorAll(".panel-nav-item").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const sectionId = btn.dataset.section;
            document.querySelectorAll(".panel-section").forEach(s => s.classList.remove("active"));
            const target = document.getElementById("section-" + sectionId);
            if (target) target.classList.add("active");
        });
    });
}

// ═══════════════════════════════════════
// FETCH & RENDER USERS
// ═══════════════════════════════════════

async function fetchAllUsers() {
    try {
        const response = await fetch("/api/admin/users");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = await response.json();
        return json.dados || json;
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        return null;
    }
}

function renderUsers(users) {
    const tbody = document.getElementById("usersBody");

    if (users === null) {
        tbody.innerHTML = `<tr><td colspan="5" class="error-cell">Erro ao carregar usuários.</td></tr>`;
        return;
    }

    if (users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="empty-cell">Nenhum usuário cadastrado.</td></tr>`;
        return;
    }

    tbody.innerHTML = users.map(user => `
        <tr data-email="${escapeAttr(user.email)}" onclick="openEditModal('${escapeAttr(user.email)}')">
            <td>${escapeHtml(user.name || '—')}</td>
            <td>${escapeHtml(user.email || '—')}</td>
            <td><span class="role-badge ${user.role === 'admin' ? 'admin' : 'user'}">${escapeHtml(user.role || 'user')}</span></td>
            <td>${escapeHtml(user.cidade || '—')}</td>
            <td>${escapeHtml(user.numTelefone || '—')}</td>
        </tr>
    `).join('');
}

function updateStats(users) {
    if (!users) return;
    const total = users.length;
    const admins = users.filter(u => u.role === "admin").length;
    document.getElementById("statTotal").textContent = total;
    document.getElementById("statAdmins").textContent = admins;
    document.getElementById("statUsers").textContent = total - admins;
}

function setupSearch() {
    document.getElementById("searchInput").addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        document.querySelectorAll("#usersBody tr").forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(query) ? "" : "none";
        });
    });
}

// ═══════════════════════════════════════
// SORT
// ═══════════════════════════════════════

function setupSort() {
    document.querySelectorAll(".sortable").forEach(th => {
        th.addEventListener("click", () => {
            const field = th.dataset.sort;
            if (currentSortField === field) {
                currentSortDir = currentSortDir === "asc" ? "desc" : "asc";
            } else {
                currentSortField = field;
                currentSortDir = "asc";
            }
            sortAndRender();
            updateSortArrows();
        });
    });
}

function sortAndRender() {
    if (!allUsers || !currentSortField) return;

    const sorted = [...allUsers].sort((a, b) => {
        const valA = (a[currentSortField] || "").toString().toLowerCase();
        const valB = (b[currentSortField] || "").toString().toLowerCase();
        if (valA < valB) return currentSortDir === "asc" ? -1 : 1;
        if (valA > valB) return currentSortDir === "asc" ? 1 : -1;
        return 0;
    });

    renderUsers(sorted);
}

function updateSortArrows() {
    document.querySelectorAll(".sortable").forEach(th => {
        const arrow = th.querySelector(".sort-arrow");
        if (th.dataset.sort === currentSortField) {
            arrow.textContent = currentSortDir === "asc" ? "▲" : "▼";
            th.classList.add("sorted");
        } else {
            arrow.textContent = "";
            th.classList.remove("sorted");
        }
    });
}

// ═══════════════════════════════════════
// EDIT MODAL
// ═══════════════════════════════════════

function openEditModal(email) {
    const user = allUsers.find(u => u.email === email);
    if (!user) return;

    // Fill form fields
    document.getElementById("editEmail").value = user.email || "";
    document.getElementById("editName").value = user.name || "";
    document.getElementById("editRole").value = user.role || "user";
    document.getElementById("editCidade").value = user.cidade || "";
    document.getElementById("editTelefone").value = user.numTelefone || "";
    document.getElementById("editNacionalidade").value = user.nacionalidade || "";
    document.getElementById("editBio").value = user.bio || "";

    // Handle date
    if (user.dataNascimento) {
        // dataNascimento may come as "YYYY-MM-DD" or as an object
        const d = typeof user.dataNascimento === "string"
            ? user.dataNascimento
            : `${user.dataNascimento.year}-${String(user.dataNascimento.monthValue || user.dataNascimento.month).padStart(2,'0')}-${String(user.dataNascimento.dayOfMonth || user.dataNascimento.day).padStart(2,'0')}`;
        document.getElementById("editNascimento").value = d;
    } else {
        document.getElementById("editNascimento").value = "";
    }

    document.getElementById("editModalOverlay").classList.add("open");
}

function closeEditModal() {
    document.getElementById("editModalOverlay").classList.remove("open");
}

async function saveUser() {
    const saveBtn = document.getElementById("btnSave");
    saveBtn.disabled = true;
    saveBtn.textContent = "Salvando...";

    const email = document.getElementById("editEmail").value;
    const nascimento = document.getElementById("editNascimento").value || null;

    const body = {
        name: document.getElementById("editName").value,
        role: document.getElementById("editRole").value,
        cidade: document.getElementById("editCidade").value,
        numTelefone: document.getElementById("editTelefone").value,
        nacionalidade: document.getElementById("editNacionalidade").value,
        bio: document.getElementById("editBio").value,
        dataNascimento: nascimento
    };

    try {
        const response = await fetch(`/api/admin/users?email=${encodeURIComponent(email)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const result = await response.json();

        if (response.ok && (result.status === "success" || result.status === true)) {
            showToast("Usuário atualizado com sucesso!", "success");
            closeEditModal();
            // Refresh table
            allUsers = await fetchAllUsers();
            renderUsers(allUsers);
            updateStats(allUsers);
        } else {
            showToast(result.mensagem || "Erro ao salvar.", "error");
        }
    } catch (e) {
        console.error(e);
        showToast("Erro de conexão.", "error");
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = "Salvar Alterações";
    }
}

function setupModal() {
    document.getElementById("modalClose").addEventListener("click", closeEditModal);
    document.getElementById("btnCancel").addEventListener("click", closeEditModal);
    document.getElementById("btnSave").addEventListener("click", saveUser);

    // Close on overlay click
    document.getElementById("editModalOverlay").addEventListener("click", (e) => {
        if (e.target === e.currentTarget) closeEditModal();
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeEditModal();
    });
}

// ═══════════════════════════════════════
// TOAST
// ═══════════════════════════════════════

function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = "toast " + type + " show";
    setTimeout(() => { toast.classList.remove("show"); }, 3500);
}

// ═══════════════════════════════════════
// UTILS
// ═══════════════════════════════════════

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

function escapeAttr(str) {
    return (str || "").replace(/'/g, "\\'").replace(/"/g, "&quot;");
}

// ═══════════════════════════════════════
// INIT
// ═══════════════════════════════════════

async function init() {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) return;

    setupSidebar();
    setupSearch();
    setupSort();
    setupModal();

    // Init locations (viagens tab)
    initLocations();

    allUsers = await fetchAllUsers();
    renderUsers(allUsers);
    updateStats(allUsers);
}

document.addEventListener("DOMContentLoaded", init);
