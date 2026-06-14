(function() {
	"use strict";

	var sidebar = document.getElementById('sidebar');
	var toggle = null;

	function initSidebar() {
		if (!sidebar) return;

		// Create toggle button (hamburger icon to open sidebar)
		toggle = document.createElement('a');
		toggle.href = '#sidebar';
		toggle.className = 'toggle';
		toggle.setAttribute('aria-label', 'Toggle sidebar navigation');
		sidebar.appendChild(toggle);

		// Create close button inside sidebar for mobile
		var closeBtn = document.createElement('a');
		closeBtn.href = '#';
		closeBtn.className = 'close-btn';
		closeBtn.setAttribute('aria-label', 'Close sidebar');
		closeBtn.innerHTML = '\u00D7';
		sidebar.querySelector('.inner').insertBefore(closeBtn, sidebar.querySelector('.inner').firstChild);

		closeBtn.addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			sidebar.classList.add('inactive');
		});

		// Set initial state based on screen width
		if (window.innerWidth <= 1280) {
			sidebar.classList.add('inactive');
		}

		// Toggle click handler
		toggle.addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			sidebar.classList.toggle('inactive');
		});

		// Close sidebar when clicking outside on small screens
		document.addEventListener('click', function(e) {
			if (window.innerWidth <= 1280) {
				if (!sidebar.contains(e.target)) {
					sidebar.classList.add('inactive');
				}
			}
		});

		// Handle window resize
		var resizeTimeout;
		window.addEventListener('resize', function() {
			clearTimeout(resizeTimeout);
			document.body.classList.add('is-resizing');
			resizeTimeout = setTimeout(function() {
				document.body.classList.remove('is-resizing');
				if (window.innerWidth > 1280) {
					sidebar.classList.remove('inactive');
				} else {
					sidebar.classList.add('inactive');
				}
			}, 100);
		});
	}

	// Initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initSidebar);
	} else {
		initSidebar();
	}

	// Scroll-Bound Reading Progress Bar
	window.addEventListener('scroll', function() {
		var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
		var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
		var scrolled = 0;
		if (height > 0) {
			scrolled = (winScroll / height) * 100;
		}
		var bar = document.getElementById('reading-progress');
		if (bar) {
			bar.style.width = scrolled + '%';
		}
	});

	// Remove loading class
	window.addEventListener('load', function() {
		document.body.classList.remove('is-loading');
	});
})();
