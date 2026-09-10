const list = document.querySelector('[data-archive-list]');
const search = document.querySelector('[data-archive-search]');
const filter = document.querySelector('[data-archive-filter]');
const meta = document.querySelector('[data-archive-meta]');
let pages = [];

const chromeLabels = new Set([
  'Skip to Content', 'Open Menu', 'Close Menu', 'Home', 'About', 'Back', 'Folder:',
  'Memberships & Classes', 'Contact', 'Shop', 'Login', 'Account', '(0)', 'Cart',
  'Book now', 'Support Us', 'FAQ', 'Location', 'Privacy Policy', 'Events', 'Gallery',
  'Coaching Team', 'Safeguarding', 'Our History', 'The Team', 'Class Schedule',
  'Our Core Values', 'Club Rules & COC', 'Memberships', 'Adult Program', 'Ladies Program',
  'Junior Program', 'Learn To Fall Program', 'Grading', 'Techniques', 'Judo Decoded',
  'Origin Brazilian Jiu Jitsu'
]);

function typeOf(page) {
  if (page.slug === 'events' || page.slug.startsWith('events--')) return 'events';
  if (page.slug === 'gallery-2' || page.slug.startsWith('gallery-2--')) return 'gallery';
  return 'club';
}

function cleanText(page) {
  const lines = page.text.split('\n');
  let contentStart = lines.findIndex((line, index) => index > 70 && !chromeLabels.has(line) && line.length > 18);
  if (contentStart < 0) contentStart = 0;
  const footer = lines.lastIndexOf('Northampton Judo Club');
  const body = lines.slice(contentStart, footer > contentStart ? footer : undefined);
  return body.filter((line, index) => !(index < 25 && chromeLabels.has(line))).join('\n');
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}

function render() {
  const term = search.value.trim().toLowerCase();
  const selected = filter.value;
  const visible = pages.filter(page => {
    const matchesType = selected === 'all' || typeOf(page) === selected;
    const matchesTerm = !term || `${page.title} ${page.text}`.toLowerCase().includes(term);
    return matchesType && matchesTerm;
  });
  meta.textContent = `${visible.length} of ${pages.length} archived pages`;
  list.innerHTML = visible.map(page => {
    const type = typeOf(page);
    const date = page.startDate ? new Date(page.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
    const text = cleanText(page);
    return `<details class="archive-item" id="${escapeHtml(page.slug)}">
      <summary><span>${type}${date ? ` · ${date}` : ''}</span><strong>${escapeHtml(page.title || 'Untitled')}</strong></summary>
      <div class="archive-copy">${escapeHtml(text || page.excerpt || 'This page contains media only. Its assets are preserved in the project archive.')}</div>
    </details>`;
  }).join('');
  if (location.hash) document.querySelector(location.hash)?.setAttribute('open', '');
}

fetch('data/content.json')
  .then(response => response.json())
  .then(data => { pages = data; render(); })
  .catch(() => { meta.textContent = 'The archive could not be loaded. Please open this site through a web server.'; });

search.addEventListener('input', render);
search.addEventListener('keyup', render);
search.addEventListener('change', render);
filter.addEventListener('change', render);
