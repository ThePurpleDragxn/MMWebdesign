/* ─── NAVIGATION ───────────────────────────────────────── */
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');

if (menuToggle && nav) {
  const toggleNav = () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  };

  menuToggle.addEventListener('click', toggleNav);

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ─── REVEAL ON SCROLL ─────────────────────────────────── */
const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: '0px 0px -4% 0px' }
  );
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('show'));
}

/* ─── ANIMATED COUNTERS ────────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.counter, 10);
  const duration = 1400;
  const start = performance.now();

  function step(now) {
    const elapsed = Math.min(now - start, duration);
    const progress = elapsed / duration;
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (elapsed < duration) requestAnimationFrame(step);
    else el.textContent = target;
  }

  requestAnimationFrame(step);
}

const counterEls = document.querySelectorAll('[data-counter]');
if (counterEls.length && 'IntersectionObserver' in window) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counterEls.forEach((el) => counterObserver.observe(el));
} else {
  counterEls.forEach((el) => {
    el.textContent = el.dataset.counter;
  });
}

/* ─── ACCORDION ────────────────────────────────────────── */
const accordionTriggers = document.querySelectorAll('.accordion-trigger');

accordionTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.accordion-item');
    if (!item) return;
    const panel = item.querySelector('.accordion-panel');
    const expanded = trigger.getAttribute('aria-expanded') === 'true';

    accordionTriggers.forEach((other) => {
      const otherItem = other.closest('.accordion-item');
      const otherPanel = otherItem?.querySelector('.accordion-panel');
      other.setAttribute('aria-expanded', 'false');
      if (otherPanel) otherPanel.style.maxHeight = '0';
    });

    trigger.setAttribute('aria-expanded', String(!expanded));
    if (panel) panel.style.maxHeight = expanded ? '0' : `${panel.scrollHeight}px`;
  });
});

/* ─── CONTACT FORM ─────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const required = contactForm.querySelectorAll('[required]');
    const invalid = Array.from(required).some((f) => !f.value.trim());
    if (invalid) {
      formStatus.textContent = 'Bitte fülle alle Pflichtfelder aus.';
      formStatus.style.color = '#ff7675';
      return;
    }

    const btn = contactForm.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Wird gesendet…'; }

    setTimeout(() => {
      formStatus.textContent = 'Vielen Dank! Ich melde mich zeitnah bei dir.';
      formStatus.style.color = '#80f2ef';
      contactForm.reset();
      if (btn) { btn.disabled = false; btn.textContent = 'Anfrage absenden'; }
    }, 800);
  });
}
