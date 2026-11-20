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

/* ---- Tableau dashboards (Connected App, Direct Trust) ---- */
const vizWrappers = document.querySelectorAll('.viz-wrapper[data-src]');

if (vizWrappers.length) {
  const loadViz = async wrapper => {
    try {
      const res = await fetch('/api/tableau-token', { cache: 'no-store' });
      if (!res.ok) throw new Error(`token request failed (${res.status})`);
      const { token } = await res.json();

      // Debug: print the JWT and its decoded claims (local development only)
      if (['localhost', '127.0.0.1'].includes(location.hostname)) {
        const [header, payload] = token.split('.').slice(0, 2)
          .map(part => JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/'))));
        console.log('Tableau JWT:', token);
        console.log('Tableau JWT header:', header, 'claims:', payload);
      }

      const viz = document.createElement('tableau-viz');
      viz.setAttribute('src', wrapper.dataset.src);
      viz.setAttribute('token', token);
      viz.setAttribute('toolbar', 'hidden');
      viz.setAttribute('hide-tabs', '');
      viz.setAttribute('width', '100%');
      viz.setAttribute('height', '100%');
      wrapper.appendChild(viz);
    } catch (err) {
      wrapper.classList.add('viz-error');
      wrapper.textContent = 'This dashboard is unavailable right now.';
      console.error(err);
    }
  };

  // Lazy-load: only request a token once a dashboard is near the viewport
  const vizObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        vizObserver.unobserve(entry.target);
        loadViz(entry.target);
      }
    });
  }, { rootMargin: '300px 0px' });

  vizWrappers.forEach(w => vizObserver.observe(w));
}
