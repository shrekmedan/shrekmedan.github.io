document.addEventListener("DOMContentLoaded", function (event) {
	const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
	const stored = localStorage.getItem('theme');

	if (stored === 'dark' || stored === 'light') {
		changeTheme(stored, false);
	} else {
		changeTheme(mediaQuery.matches ? 'dark' : 'light', false);
	}

	mediaQuery.addEventListener('change', function (e) {
		if (!localStorage.getItem('theme')) {
			changeTheme(e.matches ? 'dark' : 'light', false);
		}
	});

	// Sync theme across documents (outer page <-> iframe) using postMessage.
	// This works even when opened via file://, where direct DOM access
	// between the outer page and the iframe is blocked by the browser.
	window.addEventListener('message', function (e) {
		if (e.data && e.data.type === 'vincent-theme' && e.data.theme) {
			changeTheme(e.data.theme, false);
		}
	});
});

function toggleTheme() {
	const current = document.documentElement.getAttribute('data-theme');
	const next = current === 'dark' ? 'light' : 'dark';
	changeTheme(next, true);
}

function changeTheme(theme, broadcast) {
	document.documentElement.setAttribute('data-theme', theme);
	localStorage.setItem('theme', theme);

	if (!broadcast) return;

	// If this document has the #mainframe iframe (i.e. this IS the outer
	// page), tell the iframe's document about the new theme.
	const frame = document.getElementById('mainframe');
	if (frame && frame.contentWindow) {
		frame.contentWindow.postMessage({ type: 'vincent-theme', theme: theme }, '*');
	}

	// If this document IS the iframe content, tell the parent too, in case
	// toggling ever happens from inside the iframe in the future.
	if (window.parent && window.parent !== window) {
		window.parent.postMessage({ type: 'vincent-theme', theme: theme }, '*');
	}
}
