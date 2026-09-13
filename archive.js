const list = document.querySelector('[data-archive-list]');
const search = document.querySelector('[data-archive-search]');
const filter = document.querySelector('[data-archive-filter]');
const meta = document.querySelector('[data-archive-meta]');
const moreButton = document.querySelector('[data-archive-more]');
const viewButtons = [...document.querySelectorAll('[data-archive-view]')];
let pages = [];
let media = [];
let currentView = 'content';
let mediaLimit = 48;

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

function renderContent() {
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

function renderMedia() {
  const term = search.value.trim().toLowerCase();
  const visible = media.filter(item => !term || `${item.name} ${item.pages.join(' ')}`.toLowerCase().includes(term));
  const shown = visible.slice(0, mediaLimit);
  meta.textContent = `${visible.length} preserved media assets${shown.length < visible.length ? ` · showing ${shown.length}` : ''}`;
  list.className = 'media-grid';
  list.innerHTML = shown.map(item => `<figure class="media-item">
    <a href="assets/archive/${encodeURIComponent(item.name)}" target="_blank" rel="noopener">
      <img src="assets/archive/${encodeURIComponent(item.name)}" alt="${escapeHtml(item.label)}" loading="lazy">
    </a>
    <figcaption><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.pages.slice(0, 2).join(' · '))}</span></figcaption>
  </figure>`).join('');
  moreButton.hidden = shown.length >= visible.length;
}

function render() {
  list.className = currentView === 'content' ? 'archive-list' : 'media-grid';
  moreButton.hidden = true;
  if (currentView === 'content') renderContent(); else renderMedia();
}

function setArchiveView(nextView, syncHash = false) {
  currentView = nextView === 'media' ? 'media' : 'content';
  mediaLimit = 48;
  viewButtons.forEach(item => {
    const active = item.dataset.archiveView === currentView;
    item.classList.toggle('active', active);
    item.setAttribute('aria-selected', String(active));
  });
  filter.hidden = currentView === 'media';
  search.placeholder = currentView === 'media' ? 'Search images and source pages…' : 'Search all club content…';
  if (syncHash) {
    const nextUrl = currentView === 'media' ? '#media' : `${location.pathname}${location.search}`;
    history.replaceState(null, '', nextUrl);
  }
  render();
}

window.renderArchive = render;

fetch('data/content.json')
  .then(response => response.json())
  .then(data => {
    pages = data;
    const records = new Map();
    pages.forEach(page => page.assets.forEach(path => {
      const name = path.replace(/^assets\//, '');
      if (!/\.(?:jpe?g|png|jfif|ico)$/i.test(name)) return;
      if (!records.has(name)) records.set(name, { name, label: name.replace(/^[a-f0-9]{12}-/, '').replace(/[-_+]+/g, ' ').replace(/\s+/g, ' ').trim(), pages: [] });
      const record = records.get(name);
      if (!record.pages.includes(page.title)) record.pages.push(page.title);
    }));
    media = [...records.values()].sort((a, b) => a.label.localeCompare(b.label));
    setArchiveView(location.hash === '#media' ? 'media' : 'content');
  })
  .catch(() => { meta.textContent = 'The archive could not be loaded. Please open this site through a web server.'; });

search.addEventListener('input', render);
search.addEventListener('keyup', render);
search.addEventListener('change', render);
filter.addEventListener('change', render);
moreButton.addEventListener('click', () => { mediaLimit += 48; renderMedia(); });
viewButtons.forEach(button => button.addEventListener('click', () => setArchiveView(button.dataset.archiveView, true)));
addEventListener('hashchange', () => setArchiveView(location.hash === '#media' ? 'media' : 'content'));
