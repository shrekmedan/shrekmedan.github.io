(function() {
    function initPostNav() {
        let nav = document.getElementById('postTopNav') || document.querySelector('.post-nav-top');
        const container = document.querySelector('.post-container');
        
        if (!nav && container) {
            nav = document.createElement('div');
            nav.id = 'postTopNav';
            container.insertBefore(nav, container.firstChild);
        }

        if (nav) {
            nav.className = 'post-nav-top';
            nav.style.marginBottom = '12px';
            nav.style.display = 'flex';
            nav.style.justifyContent = 'space-between';
            nav.style.alignItems = 'center';

            const currentFile = window.location.pathname.split('/').pop() || window.location.href;

            nav.innerHTML = `
                <a href="../blog.html" class="btn-nav-action">&lt; Kembali</a>
                <a href="${currentFile}" target="_blank" class="btn-nav-action">Tab Baru</a>
            `;
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPostNav);
    } else {
        initPostNav();
    }
})();
