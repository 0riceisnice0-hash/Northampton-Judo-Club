const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu]');
const nav = document.querySelector('#main-nav');

if (header) {
  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
  updateHeader();
  addEventListener('scroll', updateHeader, { passive: true });
}

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    }
  });
}

document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

const filterButtons = document.querySelectorAll('[data-schedule-filter]');
const scheduleRows = document.querySelectorAll('.schedule-row[data-class]');

filterButtons.forEach(button => button.addEventListener('click', () => {
  const selected = button.dataset.scheduleFilter;
  filterButtons.forEach(item => item.classList.toggle('active', item === button));
  scheduleRows.forEach(row => {
    row.hidden = selected !== 'all' && row.dataset.class !== selected;
  });
}));

const revealTargets = document.querySelectorAll('.class-card, .price-grid article, .coach-list article, .photo-reel figure, .start-steps li');
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealTargets.forEach(target => target.classList.add('reveal'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(target => observer.observe(target));
}
