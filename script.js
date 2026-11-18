/* ============================================================
   DSE Portfolio — Brian King
   ============================================================ */

/* ---- Hamburger menu ---- */
const hamburger = document.querySelector('.hamburger');
const navMenu   = document.getElementById('nav-menu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!isOpen));
    navMenu.classList.toggle('nav-open', !isOpen);
  });

  // Close when any nav link is tapped
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click/tap
  document.addEventListener('click', e => {
    if (!hamburger.closest('.site-header').contains(e.target)) {
      closeMenu();
    }
  });

  function closeMenu() {
    hamburger.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('nav-open');
  }
}

/* ---- Active nav link on scroll ---- */
const sections = document.querySelectorAll('.movement[id]');
const navLinks  = document.querySelectorAll('nav a[href^="#"]');

if (sections.length && navLinks.length) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = `#${entry.target.id}`;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === target);
          });
        }
      });
    },
    {
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0
    }
  );

  sections.forEach(s => observer.observe(s));
}

/* ---- Tableau CV dashboard (Connected App, Direct Trust) ---- */
const cvViz = document.getElementById('cv-viz');

if (cvViz) {
  const loadViz = async () => {
    try {
      const res = await fetch('/api/tableau-token', { cache: 'no-store' });
      if (!res.ok) throw new Error(`token request failed (${res.status})`);
      const { token } = await res.json();

      const viz = document.createElement('tableau-viz');
      viz.setAttribute('src', cvViz.dataset.src);
      viz.setAttribute('token', token);
      viz.setAttribute('toolbar', 'hidden');
      viz.setAttribute('hide-tabs', '');
      viz.setAttribute('width', '100%');
      viz.setAttribute('height', '100%');
      cvViz.appendChild(viz);
    } catch (err) {
      cvViz.classList.add('viz-error');
      cvViz.textContent = 'The CV dashboard is unavailable right now.';
      console.error(err);
    }
  };

  // Lazy-load: only request a token once the dashboard is near the viewport
  const vizObserver = new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting)) {
      vizObserver.disconnect();
      loadViz();
    }
  }, { rootMargin: '300px 0px' });

  vizObserver.observe(cvViz);
}
