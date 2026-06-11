// ===== NAVIGATION =====
document.addEventListener('DOMContentLoaded', () => {
  buildSidebar();
  setupSearch();
  setupMobileMenu();
  route();
  window.addEventListener('popstate', route);
});

function route() {
  const path = window.location.pathname;
  if (path === '/' || path === '/index.html' || path === '') {
    showHome();
  } else if (path.startsWith('/guide/')) {
    showGuide(path.replace('/guide/', ''));
  } else if (path.startsWith('/section/')) {
    showSection(path.replace('/section/', ''));
  } else {
    showHome();
  }
}

function navigate(path) {
  history.pushState({}, '', path);
  route();
  closeMobileMenu();
  window.scrollTo(0, 0);
}

// ===== BUILD SIDEBAR =====
function buildSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = '';
  SECTIONS.forEach(section => {
    const div = document.createElement('div');
    div.className = 'sidebar-section';
    div.dataset.sectionId = section.id;
    div.innerHTML = `
      <div class="sidebar-section-header" onclick="toggleSection('${section.id}')">
        <span>${section.title} <span class="sidebar-chevron">›</span></span>
        <span class="sidebar-section-count">${section.guides.length}</span>
      </div>
      <div class="sidebar-guides" id="section-guides-${section.id}">
        ${section.guides.map(g => `
          <a class="sidebar-guide-link" id="nav-${g.slug}"
             href="/guide/${g.slug}"
             onclick="event.preventDefault(); navigate('/guide/${g.slug}')"
          >${g.title}</a>
        `).join('')}
      </div>`;
    sidebar.appendChild(div);
  });
}

function toggleSection(id) {
  const div = document.querySelector(`.sidebar-section[data-section-id="${id}"]`);
  div.classList.toggle('open');
  div.querySelector('.sidebar-section-header').classList.toggle('active', div.classList.contains('open'));
}

function openSection(id) {
  const div = document.querySelector(`.sidebar-section[data-section-id="${id}"]`);
  if (div && !div.classList.contains('open')) {
    div.classList.add('open');
    div.querySelector('.sidebar-section-header').classList.add('active');
  }
}

function setActiveGuide(slug) {
  document.querySelectorAll('.sidebar-guide-link').forEach(el => {
    el.classList.toggle('active', el.id === `nav-${slug}`);
  });
}

// ===== HOME =====
function showHome() {
  document.title = 'OS & Installation Guides';
  document.querySelectorAll('.sidebar-guide-link').forEach(el => el.classList.remove('active'));
  document.getElementById('main-content').innerHTML = `
    <div class="home-hero">
      <h1>OS & Installation Guides</h1>
      <p>Practical guides for problems that are hard to find solutions for online.</p>
    </div>
    <div class="home-notices">
      <div class="notice">⚠️ Please read everything before typing any command. If you do not understand what a command does, you are not ready to run it. If you choose to skip ahead — good luck spending days on Google, forums, and videos. This site exists so you do not have to.</div>
      <div class="notice">📋 A note on accuracy: These guides are written from real experience, official documentation, and community knowledge — but no guide is perfect. Most should be accurate, but some steps may differ depending on your hardware, OS version, or configuration. If something does not work, cross-reference with Google or the official docs for that tool.</div>
      <div class="notice">🕐 A note on outdated guides: Some guides may no longer reflect the current state of the software, repository, or tool they cover. Things change — repos move, commands change, projects get discontinued. If a guide feels off, check the official source first.</div>
    </div>
    <div class="home-sections">
      ${SECTIONS.map(s => `
        <a class="section-card" href="/section/${s.id}"
           onclick="event.preventDefault(); navigate('/section/${s.id}')">
          <div class="section-card-title">${s.title}</div>
          <div class="section-card-count">${s.guides.length} guides</div>
        </a>
      `).join('')}
    </div>`;
  document.getElementById('page-toc').innerHTML = '';
}

// ===== SECTION =====
function showSection(sectionId) {
  const section = SECTIONS.find(s => s.id === sectionId);
  if (!section) { showHome(); return; }
  document.title = `${section.title} — OS & Installation Guides`;
  openSection(sectionId);
  document.getElementById('main-content').innerHTML = `
    <div class="guide-breadcrumb">
      <a href="/" onclick="event.preventDefault(); navigate('/')">Home</a>
      <span>›</span>
      <span>${section.title}</span>
    </div>
    <div class="guide-content">
      <h1>${section.title}</h1>
      <div style="display:flex;flex-direction:column;gap:4px;margin-top:8px;">
        ${section.guides.map(g => `
          <a href="/guide/${g.slug}"
             onclick="event.preventDefault(); navigate('/guide/${g.slug}')"
             style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border:1px solid var(--border);border-radius:7px;text-decoration:none;color:var(--text);transition:all .15s;"
             onmouseover="this.style.borderColor='var(--accent)';this.style.background='var(--accent-light)'"
             onmouseout="this.style.borderColor='var(--border)';this.style.background=''">
            <span style="font-size:14px">${g.title}</span>
            <span style="color:var(--text-muted);font-size:12px">→</span>
          </a>
        `).join('')}
      </div>
    </div>`;
  document.getElementById('page-toc').innerHTML = '';
}

// ===== GUIDE =====
async function showGuide(slug) {
  const guide = ALL_GUIDES.find(g => g.slug === slug);
  if (!guide) { showHome(); return; }
  const section = SECTIONS.find(s => s.parent === guide.parent);
  if (section) openSection(section.id);
  setActiveGuide(slug);
  const activeLink = document.getElementById(`nav-${slug}`);
  if (activeLink) activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  document.title = `${guide.title} — OS & Installation Guides`;
  const content = document.getElementById('main-content');
  content.innerHTML = '<div style="padding:60px 0;text-align:center;color:var(--text-muted)">Loading…</div>';
  try {
    const resp = await fetch(`/guides/${slug}.html`);
    if (!resp.ok) throw new Error();
    const raw = await resp.text();
    const lines = raw.split('\n');
    const html = lines.slice(1).join('\n');
    content.innerHTML = `
      <div class="guide-breadcrumb">
        <a href="/" onclick="event.preventDefault(); navigate('/')">Home</a>
        <span>›</span>
        ${section ? `<a href="/section/${section.id}" onclick="event.preventDefault(); navigate('/section/${section.id}')">${guide.parent}</a>` : `<span>${guide.parent}</span>`}
        <span>›</span>
        <span>${guide.title}</span>
      </div>
      <div class="guide-content" id="guide-body">${html}</div>
      <div id="guide-nav-placeholder"></div>`;
    addCopyButtons();
    buildTOC();
    buildGuideNav(slug, section);
    window.scrollTo(0, 0);
  } catch(e) {
    content.innerHTML = `<div style="padding:40px 0"><h1>Guide not found</h1><p style="color:var(--text-muted);margin:12px 0">This guide could not be loaded.</p><a href="/" onclick="event.preventDefault();navigate('/')" style="color:var(--accent)">← Back to home</a></div>`;
  }
}

// ===== TOC =====
function buildTOC() {
  const toc = document.getElementById('page-toc');
  const body = document.getElementById('guide-body');
  if (!body) { toc.innerHTML = ''; return; }
  const headings = body.querySelectorAll('h2, h3');
  if (headings.length < 2) { toc.innerHTML = ''; return; }
  headings.forEach((h, i) => {
    if (!h.id) h.id = 'h-' + h.textContent.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').substring(0, 40) + '-' + i;
  });
  toc.innerHTML = `
    <div class="toc-label">On this page</div>
    <ul class="toc-list">
      ${Array.from(headings).map(h => `
        <li><a href="#${h.id}" class="${h.tagName==='H3'?'toc-h3':''}"
               onclick="event.preventDefault();scrollToHeading('${h.id}')">${h.textContent}</a></li>
      `).join('')}
    </ul>`;
  setupTOCScroll(headings);
}

function scrollToHeading(id) {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
}

function setupTOCScroll(headings) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        document.querySelectorAll('.toc-list a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
      }
    });
  }, { rootMargin: '-72px 0px -70% 0px' });
  headings.forEach(h => observer.observe(h));
}

// ===== PREV/NEXT =====
function buildGuideNav(slug, section) {
  if (!section) return;
  const guides = section.guides;
  const idx = guides.findIndex(g => g.slug === slug);
  const prev = idx > 0 ? guides[idx-1] : null;
  const next = idx < guides.length-1 ? guides[idx+1] : null;
  if (!prev && !next) return;
  const placeholder = document.getElementById('guide-nav-placeholder');
  if (!placeholder) return;
  placeholder.innerHTML = `
    <div class="guide-nav">
      ${prev ? `<a class="guide-nav-link prev" href="/guide/${prev.slug}" onclick="event.preventDefault();navigate('/guide/${prev.slug}')">
        <div class="guide-nav-label">← Previous</div>
        <div class="guide-nav-title">${prev.title}</div></a>` : '<div></div>'}
      ${next ? `<a class="guide-nav-link next" href="/guide/${next.slug}" onclick="event.preventDefault();navigate('/guide/${next.slug}')">
        <div class="guide-nav-label">Next →</div>
        <div class="guide-nav-title">${next.title}</div></a>` : '<div></div>'}
    </div>`;
}

// ===== COPY BUTTONS =====
function addCopyButtons() {
  document.querySelectorAll('pre').forEach(pre => {
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.onclick = () => {
      navigator.clipboard.writeText(pre.querySelector('code')?.textContent || pre.textContent).then(() => {
        btn.textContent = 'Copied!'; btn.classList.add('copied');
        setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1500);
      });
    };
    wrapper.appendChild(btn);
  });
}

// ===== SEARCH =====
function setupSearch() {
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  const overlay = document.getElementById('search-overlay');
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) { results.classList.remove('open'); overlay.classList.remove('open'); return; }
    const matches = ALL_GUIDES.filter(g => g.title.toLowerCase().includes(q) || (g.preview && g.preview.toLowerCase().includes(q))).slice(0, 10);
    results.innerHTML = matches.length === 0
      ? `<div class="search-no-results">No results for "${q}"</div>`
      : matches.map(g => `<a class="search-result-item" href="/guide/${g.slug}" onclick="event.preventDefault();closeSearch();navigate('/guide/${g.slug}')">
          <div class="search-result-title">${highlight(g.title, q)}</div>
          <div class="search-result-section">${g.parent}</div></a>`).join('');
    results.classList.add('open'); overlay.classList.add('open');
  });
  input.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });
  overlay.addEventListener('click', closeSearch);
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); input.focus(); input.select(); }
  });
}

function highlight(text, q) {
  return text.replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<mark style="background:#fef08a;border-radius:2px;padding:0 1px">$1</mark>');
}

function closeSearch() {
  document.getElementById('search-results').classList.remove('open');
  document.getElementById('search-overlay').classList.remove('open');
}

// ===== MOBILE =====
function setupMobileMenu() {
  document.getElementById('menu-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebar-overlay').classList.toggle('open');
  });
  document.getElementById('sidebar-overlay').addEventListener('click', closeMobileMenu);
}
function closeMobileMenu() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');
}
