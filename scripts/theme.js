(function () {
    try {
        var stored = localStorage.getItem('theme');
        var theme = stored === 'dark' || stored === 'light'
            ? stored
            : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {}
})();

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    changeTheme(next, true);
}

function changeTheme(theme, broadcast) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
    if (!broadcast) return;
    const frame = document.getElementById('mainframe');
    if (frame && frame.contentWindow) frame.contentWindow.postMessage({ type: 'vincent-theme', theme: theme }, '*');
    if (window.parent && window.parent !== window) window.parent.postMessage({ type: 'vincent-theme', theme: theme }, '*');
}

document.addEventListener('DOMContentLoaded', function () {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', function (e) {
        if (!localStorage.getItem('theme')) changeTheme(e.matches ? 'dark' : 'light', false);
    });
    window.addEventListener('message', function (e) {
        if (e.data && e.data.type === 'vincent-theme' && e.data.theme) changeTheme(e.data.theme, false);
    });
    const loadSoundCloud = document.getElementById('loadSoundCloud');
    const musicPlayer = document.getElementById('musicplayer');
    if (loadSoundCloud && musicPlayer) {
        loadSoundCloud.addEventListener('click', function () {
            const src = musicPlayer.dataset.soundcloudSrc;
            if (!src) return;
            musicPlayer.innerHTML = '';
            const iframe = document.createElement('iframe');
            iframe.width = '100%';
            iframe.height = '450';
            iframe.title = 'SoundCloud player';
            iframe.loading = 'lazy';
            iframe.allow = 'autoplay';
            iframe.src = src;
            musicPlayer.appendChild(iframe);
        }, { once: true });
    }

    // Live Clock & Hit Counter (Stats Widget)
    const clockEl = document.getElementById('liveClock');
    if (clockEl) {
        function updateClock() {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');
            const s = String(now.getSeconds()).padStart(2, '0');
            clockEl.textContent = `${h}:${m}:${s} WIB`;
        }
        updateClock();
        setInterval(updateClock, 1000);
    }

    const hitEl = document.getElementById('hitCounter');
    if (hitEl) {
        let hits = parseInt(localStorage.getItem('tukangolah_hits') || '4828', 10) + 1;
        try { localStorage.setItem('tukangolah_hits', hits); } catch (e) {}
        hitEl.textContent = String(hits).padStart(6, '0');
    }
});
