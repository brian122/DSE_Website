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
