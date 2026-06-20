document.addEventListener('DOMContentLoaded', init);

let destination = null;

async function init() {
    const params = new URLSearchParams(window.location.search);
    const destId = params.get('id');

    if (!destId) {
        showError();
        return;
    }

    try {
        // Fetch destination info. We fetch all from /search as a reliable open endpoint
        const res = await fetch('/api/location/search', {
            method: 'GET',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        if (!res.ok) throw new Error('Falha ao buscar destinos');

        const result = await res.json();
        if (!result.status || !result.dados) throw new Error('Formato inválido');

        const locIdInt = parseInt(destId, 10);
        // Sometimes backend returns string ID or int ID depending on DB
        destination = result.dados.find(loc => loc.id === destId || loc.id === locIdInt);

        if (destination) {
            renderDestination(destination);
        } else {
            showError();
        }

    } catch (err) {
        console.error(err);
        showError();
    }
}

function renderDestination(loc) {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('reserveContainer').style.display = 'grid';

    document.getElementById('destImage').src = loc.imageUrl || '';
    document.getElementById('destContinent').textContent = loc.continent || '🌍';
    document.getElementById('destName').textContent = loc.name || 'Destino Incrível';
    document.getElementById('destCountry').textContent = loc.country || 'Desconhecido';
    document.getElementById('destDescription').textContent = loc.description || 'Um destino fantástico esperando por você.';

    document.getElementById('destPrice').textContent = formatPrice(loc.price);

    if (loc.latitude && loc.longitude) {
        const mapBox = document.getElementById('destMapBox');
        const mapFrame = document.getElementById('destMap');
        mapFrame.src = `https://maps.google.com/maps?q=${loc.latitude},${loc.longitude}&z=12&output=embed`;
        mapBox.style.display = 'block';
    }

    setupCalculations();
}

function showError() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('reserveContainer').style.display = 'none';
    document.getElementById('errorState').style.display = 'block';
}

function setupCalculations() {
    const checkIn = document.getElementById('checkIn');
    const checkOut = document.getElementById('checkOut');

    // Default values: tomorrow and next week
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    checkIn.valueAsDate = tomorrow;

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 8);
    checkOut.valueAsDate = nextWeek;

    const inputs = [checkIn, checkOut];
    inputs.forEach(inp => inp.addEventListener('change', updateSummary));

    updateSummary();

    document.getElementById('bookForm').addEventListener('submit', handleBookingSubmit);
}

function updateSummary() {
    const checkInVal = document.getElementById('checkIn').valueAsDate;
    const checkOutVal = document.getElementById('checkOut').valueAsDate;

    let days = 0;
    if (checkInVal && checkOutVal && checkOutVal > checkInVal) {
        const diffTime = Math.abs(checkOutVal - checkInVal);
        days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    document.getElementById('summaryDays').textContent = days;

    const total = destination.price ? destination.price * days : 0;
    document.getElementById('summaryTotal').textContent = formatPrice(total);
}

async function handleBookingSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('btnConfirm');
    btn.classList.add('loading');

    try {
        const days = parseInt(document.getElementById('summaryDays').textContent);
        const checkInVal = document.getElementById('checkIn').value;
        const checkOutVal = document.getElementById('checkOut').value;

        if (days <= 0) {
            showToast('As datas de check-in e check-out são inválidas.');
            btn.classList.remove('loading');
            return;
        }

        const payload = {
            locationId: destination.id,
            checkIn: checkInVal,
            checkOut: checkOutVal
        };

        const res = await fetch("/api/book", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        let result;
        try {
            result = await res.json();
        } catch (e) {
            // Ignorar erro de json
        }

        if (!res.ok) {
            throw new Error((result && result.mensagem) ? result.mensagem : `Erro ao tentar reservar (HTTP ${res.status})`);
        }

        showToast('Reserva confirmada com sucesso! Boa viagem! ✈️', true);

        setTimeout(() => {
            window.location.href = '/search';
        }, 2000);

    } catch (err) {
        console.error(err);
        showToast(err.message || 'Ocorreu um erro ao processar sua reserva.');
    } finally {
        btn.classList.remove('loading');
    }
}

function formatPrice(value) {
    if (!value && value !== 0) return '—';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
    }).format(value);
}

function showToast(message, isSuccess = false) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.cssText = `
      position:fixed; bottom:28px; left:50%;
      transform:translateX(-50%) translateY(20px);
      background: ${isSuccess ? 'rgba(40, 167, 69, 0.9)' : '#1e3a52'}; 
      border:1px solid ${isSuccess ? '#28a745' : 'var(--gold)'};
      border-radius:10px; padding:12px 24px;
      font-size:0.88rem; color:#f5f0e8;
      opacity:0; transition:opacity .3s, transform .3s;
      z-index:999; white-space:nowrap;
    `;

    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 3000);
}
