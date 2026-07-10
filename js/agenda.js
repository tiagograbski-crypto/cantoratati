const STORAGE_KEY = 'agenda_tati_vanzan';

const cfg = window.SITE_CONFIG || {};
const ADMIN_PIN = cfg.admin?.pin || '1234';

const STATUS = {
    AVAILABLE: 'available',
    RESERVED: 'reserved',
    BLOCKED: 'blocked',
};

let isAdmin = false;
let availabilityData = {};
let savedMeta = { updatedAt: null };
let hasUnsavedChanges = false;
let selectedAdminDate = null;
let selectedAdminDateLabel = '';

const today = new Date();
today.setHours(0, 0, 0, 0);

let viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
const maxDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

const publicGrid = document.getElementById('calendar-grid');
const adminGrid = document.getElementById('admin-calendar-grid');
const monthDisplay = document.getElementById('calendar-month-display');
const adminMonthDisplay = document.getElementById('admin-calendar-month-display');

const adminSelectedDateEl = document.getElementById('admin-selected-date');
const adminMarkReservedBtn = document.getElementById('admin-mark-reserved');
const adminMarkBlockedBtn = document.getElementById('admin-mark-blocked');
const adminMarkFreeBtn = document.getElementById('admin-mark-free');

function normalizeStatus(raw) {
    if (raw === 'occupied' || raw === STATUS.BLOCKED) return STATUS.BLOCKED;
    if (raw === STATUS.RESERVED) return STATUS.RESERVED;
    return STATUS.AVAILABLE;
}

function statusLabel(status) {
    if (status === STATUS.RESERVED) return 'Reservado';
    if (status === STATUS.BLOCKED) return 'Indisponível';
    return 'Livre';
}

function setSaveStatus(message, type = 'info') {
    const el = document.getElementById('admin-save-status');
    if (!el) return;
    el.textContent = message;
    el.className = `admin-publish-status admin-publish-status--${type}`;
}

function setLastSavedLabel(iso) {
    const el = document.getElementById('admin-last-saved');
    if (!el) return;
    if (!iso) {
        el.textContent = 'Último salvamento: —';
        return;
    }
    el.textContent = `Último salvamento: ${new Date(iso).toLocaleString('pt-BR')}`;
}

function updateAdminDatePanel() {
    const hasSelection = Boolean(selectedAdminDate);
    const currentStatus = hasSelection ? normalizeStatus(availabilityData[selectedAdminDate]) : STATUS.AVAILABLE;

    if (adminSelectedDateEl) {
        if (!hasSelection) {
            adminSelectedDateEl.textContent = 'Selecione um dia no calendário';
        } else {
            adminSelectedDateEl.textContent = `${selectedAdminDateLabel} · ${statusLabel(currentStatus)}`;
        }
    }

    if (adminMarkReservedBtn) adminMarkReservedBtn.disabled = !hasSelection;
    if (adminMarkBlockedBtn) adminMarkBlockedBtn.disabled = !hasSelection;

    if (adminMarkFreeBtn) {
        const showFree = hasSelection && currentStatus !== STATUS.AVAILABLE;
        adminMarkFreeBtn.classList.toggle('hidden', !showFree);
        adminMarkFreeBtn.disabled = !showFree;
    }
}

function selectAdminDate(dateStr, dateDisplayStr) {
    selectedAdminDate = dateStr;
    selectedAdminDateLabel = dateDisplayStr;
    updateAdminDatePanel();
    renderAllCalendars();
}

function clearAdminSelection() {
    selectedAdminDate = null;
    selectedAdminDateLabel = '';
    updateAdminDatePanel();
}

function applyAgendaPayload(payload) {
    availabilityData = payload?.dates || {};
    savedMeta.updatedAt = payload?.updatedAt || null;
    setLastSavedLabel(savedMeta.updatedAt);
    hasUnsavedChanges = false;
    updateAdminDatePanel();
    renderAllCalendars();
}

async function fetchAgendaFromSite() {
    const response = await fetch(`${import.meta.env.BASE_URL}data/agenda.json?t=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Arquivo de agenda não encontrado.');
    return response.json();
}

async function loadAgenda() {
    try {
        const payload = await fetchAgendaFromSite();
        applyAgendaPayload(payload);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        return;
    } catch {}

    try {
        const local = localStorage.getItem(STORAGE_KEY);
        if (local) applyAgendaPayload(JSON.parse(local));
    } catch {}

    renderAllCalendars();
}

function applyDayStatus(btn, status, { adminMode, isPast, isBeyondMax, dateStr }) {
    btn.classList.add(`calendar-day--${status}`);

    if (adminMode) {
        btn.classList.add('calendar-day--admin');
        if (dateStr === selectedAdminDate) btn.classList.add('calendar-day--selected');
        btn.title = `${statusLabel(status)} — clique para selecionar`;
        return;
    }

    if (isPast || isBeyondMax) {
        btn.disabled = true;
        btn.classList.add('calendar-day--past');
        return;
    }

    if (status === STATUS.AVAILABLE) return;

    btn.disabled = true;
    btn.classList.add('calendar-day--unavailable');
    btn.title = status === STATUS.RESERVED ? 'Data ocupada' : 'Data indisponível';
}

function renderCalendar(gridEl, monthLabelEl, { adminMode }) {
    if (!gridEl) return;

    gridEl.innerHTML = '';

    const month = viewDate.getMonth();
    const year = viewDate.getFullYear();
    const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(viewDate);

    if (monthLabelEl) monthLabelEl.textContent = monthName;
    if (monthLabelEl === adminMonthDisplay && monthDisplay) monthDisplay.textContent = monthName;
    if (monthLabelEl === monthDisplay && adminMonthDisplay) adminMonthDisplay.textContent = monthName;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const prevBtn = adminMode ? document.getElementById('admin-prev-month-btn') : document.getElementById('prev-month-btn');
    const nextBtn = adminMode ? document.getElementById('admin-next-month-btn') : document.getElementById('next-month-btn');

    if (prevBtn) prevBtn.disabled = year === today.getFullYear() && month === today.getMonth();
    if (nextBtn) nextBtn.disabled = year === maxDate.getFullYear() && month === maxDate.getMonth();

    for (let i = 0; i < firstDayIndex; i++) {
        gridEl.appendChild(document.createElement('div'));
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const currentIterDate = new Date(year, month, day);
        currentIterDate.setHours(0, 0, 0, 0);

        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dateDisplayStr = `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`;

        const isPast = currentIterDate < today;
        const isBeyondMax = currentIterDate > maxDate;
        const status = normalizeStatus(availabilityData[dateStr]);

        const btn = document.createElement('button');
        btn.className = 'calendar-day aspect-square w-full mx-auto rounded-full flex items-center justify-center relative transition-all duration-300 group';
        btn.textContent = String(day);

        applyDayStatus(btn, status, { adminMode, isPast, isBeyondMax, dateStr });

        if (adminMode) {
            btn.type = 'button';
            btn.onclick = () => selectAdminDate(dateStr, dateDisplayStr);
        } else if (!isPast && !isBeyondMax && status === STATUS.AVAILABLE) {
            btn.onclick = () => window.openBookingModal(dateDisplayStr);
        }

        gridEl.appendChild(btn);
    }
}

function renderAllCalendars() {
    renderCalendar(publicGrid, monthDisplay, { adminMode: false });
    renderCalendar(adminGrid, adminMonthDisplay, { adminMode: isAdmin });
    updateUnsavedBadge();
}

function updateUnsavedBadge() {
    const badge = document.getElementById('admin-unsaved-badge');
    if (badge) badge.classList.toggle('hidden', !hasUnsavedChanges);
}

function shiftMonth(delta) {
    viewDate.setMonth(viewDate.getMonth() + delta);
    renderAllCalendars();
}

function markSelectedDate(status) {
    if (!isAdmin || !selectedAdminDate) return;

    availabilityData[selectedAdminDate] = status;
    hasUnsavedChanges = true;
    updateAdminDatePanel();
    renderAllCalendars();
    setSaveStatus('Alteração feita. Clique em Salvar agenda para gravar.', 'warn');
}

function releaseSelectedDate() {
    if (!isAdmin || !selectedAdminDate) return;

    delete availabilityData[selectedAdminDate];
    hasUnsavedChanges = true;
    updateAdminDatePanel();
    renderAllCalendars();
    setSaveStatus('Data liberada. Clique em Salvar agenda para gravar.', 'warn');
}

document.getElementById('prev-month-btn')?.addEventListener('click', () => shiftMonth(-1));
document.getElementById('next-month-btn')?.addEventListener('click', () => shiftMonth(1));
document.getElementById('admin-prev-month-btn')?.addEventListener('click', () => shiftMonth(-1));
document.getElementById('admin-next-month-btn')?.addEventListener('click', () => shiftMonth(1));

adminMarkReservedBtn?.addEventListener('click', () => markSelectedDate(STATUS.RESERVED));
adminMarkBlockedBtn?.addEventListener('click', () => markSelectedDate(STATUS.BLOCKED));
adminMarkFreeBtn?.addEventListener('click', releaseSelectedDate);

async function saveAgenda() {
    const btn = document.getElementById('admin-save-btn');
    const btnHtml = '<i class="fa-solid fa-floppy-disk"></i> Salvar agenda';
    const payload = {
        updatedAt: new Date().toISOString(),
        dates: availabilityData,
    };

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Salvando...';
    setSaveStatus('Salvando agenda...', 'info');

    try {
        const response = await fetch('/api/agenda/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dates: availabilityData }),
        });

        if (response.ok) {
            const saved = await response.json();
            applyAgendaPayload(saved);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
            setSaveStatus('Agenda salva em public/data/agenda.json', 'success');
            btn.disabled = false;
            btn.innerHTML = btnHtml;
            return;
        }
    } catch {}

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    applyAgendaPayload(payload);
    setSaveStatus('Salva no navegador. Rode npm run dev para gravar no arquivo do projeto.', 'success');
    btn.disabled = false;
    btn.innerHTML = btnHtml;
}

function openAdminDashboard() {
    const panel = document.getElementById('admin-dashboard');
    if (!panel) return;
    panel.classList.remove('hidden');
    panel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('admin-dashboard-open');
    clearAdminSelection();
    renderAllCalendars();
    setSaveStatus('Selecione um dia e escolha reservado ou indisponível. Depois clique em Salvar.', 'info');
}

function closeAdminDashboard() {
    const panel = document.getElementById('admin-dashboard');
    if (!panel) return;
    panel.classList.add('hidden');
    panel.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('admin-dashboard-open');
    isAdmin = false;
    clearAdminSelection();
    renderAllCalendars();
}

const adminModal = document.getElementById('admin-modal');
const adminModalContent = document.getElementById('admin-modal-content');
const adminPinInput = document.getElementById('admin-pin');

window.openAdminLogin = () => {
    adminModal?.classList.remove('opacity-0', 'pointer-events-none');
    setTimeout(() => {
        adminModalContent?.classList.remove('scale-95');
        adminPinInput?.focus();
    }, 10);
};

window.closeAdminLogin = () => {
    adminModalContent?.classList.add('scale-95');
    setTimeout(() => {
        adminModal?.classList.add('opacity-0', 'pointer-events-none');
        document.getElementById('admin-error')?.classList.add('hidden');
        if (adminPinInput) adminPinInput.value = '';
    }, 300);
};

window.submitAdminLogin = () => {
    const pin = adminPinInput?.value || '';
    if (pin === ADMIN_PIN) {
        isAdmin = true;
        window.closeAdminLogin();
        openAdminDashboard();
    } else {
        document.getElementById('admin-error')?.classList.remove('hidden');
    }
};

window.exitAdmin = () => {
    closeAdminDashboard();
    setSaveStatus('', 'info');
};

adminPinInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') window.submitAdminLogin();
});

document.getElementById('admin-save-btn')?.addEventListener('click', saveAgenda);

loadAgenda();
