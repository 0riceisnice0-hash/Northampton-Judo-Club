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

