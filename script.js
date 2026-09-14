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

const enquirySelect = document.querySelector('select[name="enquiry"]');
document.querySelectorAll('[data-enquiry]').forEach(link => link.addEventListener('click', () => {
  if (enquirySelect && [...enquirySelect.options].some(option => option.value === link.dataset.enquiry)) {
    enquirySelect.value = link.dataset.enquiry;
  }
}));

const priceTabs = document.querySelectorAll('[data-price-tab]');
const pricePanels = document.querySelectorAll('[data-price-panel]');
priceTabs.forEach(tab => tab.addEventListener('click', () => {
  const selected = tab.dataset.priceTab;
  priceTabs.forEach(item => {
    const active = item === tab;
    item.classList.toggle('active', active);
    item.setAttribute('aria-selected', String(active));
  });
  pricePanels.forEach(panel => {
    const active = panel.dataset.pricePanel === selected;
    panel.hidden = !active;
    panel.classList.toggle('active', active);
  });
}));

const revealTargets = document.querySelectorAll('.class-card, .trial-card, .pricing-panel a, .coach-list article, .photo-reel figure, .start-steps li');
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

const contactForm = document.querySelector('[data-formspree-form]');
const formStatus = document.querySelector('[data-form-status]');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', event => {
    if (contactForm.action.includes('YOUR_FORM_ID')) {
      event.preventDefault();
      formStatus.innerHTML = 'The online form is being connected. For now, email <a href="mailto:action@northamptonjudo.com">action@northamptonjudo.com</a>.';
      formStatus.classList.add('notice');
    }
  });
}
