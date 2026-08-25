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
});
