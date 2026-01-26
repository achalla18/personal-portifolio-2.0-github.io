// Boot sequence
setTimeout(() => {
    document.getElementById('bootScreen').classList.add('hidden');
}, 2200);

// Clock
function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('date').textContent = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
updateClock();
setInterval(updateClock, 1000);

// Window Management
let activeWindow = null;
let zIndex = 100;

function openWindow(name) {
    const win = document.getElementById('window-' + name);
    if (!win) return;
    win.classList.add('open');
    win.classList.remove('minimized');
    bringToFront(win);
    updateTaskbar();
    document.getElementById('startMenu').classList.remove('open');
}

function closeWindow(win) {
    win.classList.remove('open', 'maximized');
    updateTaskbar();
}

function minimizeWindow(win) {
    win.classList.add('minimized');
    updateTaskbar();
}

function maximizeWindow(win) {
    win.classList.toggle('maximized');
}

function bringToFront(win) {
    zIndex++;
    win.style.zIndex = zIndex;
    activeWindow = win;
}

function updateTaskbar() {
    document.querySelectorAll('.taskbar-app').forEach(btn => {
        const winName = btn.dataset.window;
        const win = document.getElementById('window-' + winName);
        btn.classList.toggle('active', win && win.classList.contains('open') && !win.classList.contains('minimized'));
    });
    document.querySelectorAll('.mobile-nav-item').forEach(btn => {
        const winName = btn.dataset.window;
        const win = document.getElementById('window-' + winName);
        btn.classList.toggle('active', win && win.classList.contains('open') && !win.classList.contains('minimized'));
    });
}

// Event Listeners - Desktop Icons (single click)
document.querySelectorAll('.desktop-icon').forEach(icon => {
    icon.addEventListener('click', () => {
        document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('active'));
        icon.classList.add('active');
        
        // Handle external links
        if (icon.dataset.link) {
            window.open(icon.dataset.link, '_blank');
        } else if (icon.dataset.window) {
            openWindow(icon.dataset.window);
        }
    });
});

// Taskbar and Start Menu clicks
document.querySelectorAll('.taskbar-app, .start-menu-item, .mobile-nav-item').forEach(btn => {
    btn.addEventListener('click', () => openWindow(btn.dataset.window));
});

// Window control buttons
document.querySelectorAll('.window-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const win = btn.closest('.window');
        const action = btn.dataset.action;
        if (action === 'close') closeWindow(win);
        else if (action === 'minimize') minimizeWindow(win);
        else if (action === 'maximize') maximizeWindow(win);
    });
});

// Click on window to bring to front
document.querySelectorAll('.window').forEach(win => {
    win.addEventListener('mousedown', () => bringToFront(win));
});

// Start Menu toggle
document.getElementById('startBtn').addEventListener('click', () => {
    document.getElementById('startMenu').classList.toggle('open');
});

// Close start menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.start-menu') && !e.target.closest('#startBtn')) {
        document.getElementById('startMenu').classList.remove('open');
    }
});

// Draggable Windows
document.querySelectorAll('.window-titlebar').forEach(titlebar => {
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    const win = titlebar.closest('.window');

    titlebar.addEventListener('mousedown', (e) => {
        if (e.target.closest('.window-controls') || win.classList.contains('maximized')) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = win.offsetLeft;
        startTop = win.offsetTop;
        bringToFront(win);
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        win.style.left = (startLeft + e.clientX - startX) + 'px';
        win.style.top = (startTop + e.clientY - startY) + 'px';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    titlebar.addEventListener('dblclick', (e) => {
        if (!e.target.closest('.window-controls')) maximizeWindow(win);
    });
});

// Desktop click to deselect icons
document.getElementById('desktop').addEventListener('click', (e) => {
    if (e.target.closest('.desktop-icon') || e.target.closest('.window')) return;
    document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('active'));
});
