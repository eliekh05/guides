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

// ===== SIDEBAR =====
function buildSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = `<div class="sidebar-dir-root">~/guides/</div>`;
  SECTIONS.forEach(section => {
    const div = document.createElement('div');
    div.className = 'sidebar-section';
    div.dataset.sectionId = section.id;
    div.classList.add('open');
    div.innerHTML = `
      <div class="sidebar-section-header active" onclick="toggleSection('${section.id}')">
        <span class="sidebar-section-label">
          <span class="sidebar-dir-prefix">./</span>${section.title.toLowerCase().replace(/ /g, '-')}
        </span>
        <span style="display:flex;align-items:center;gap:6px">
          <span class="sidebar-section-count">${section.guides.length}</span>
          <span class="sidebar-chevron">›</span>
        </span>
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

  const totalGuides = ALL_GUIDES.length;
  const statsRows = SECTIONS.filter(s => s.guides.length > 0).map(s =>
    `<div class="stat-cell" onclick="navigate('/section/${s.id}')" title="Browse ${s.title}">
      <div class="stat-label">SECTION</div>
      <div class="stat-value">${s.guides.length}</div>
      <div class="stat-name">${s.title}</div>
    </div>`
  ).join('');

  document.getElementById('main-content').innerHTML = `
    <div class="terminal-block">
      <div class="terminal-titlebar">
        <div class="terminal-dot red"></div>
        <div class="terminal-dot yellow"></div>
        <div class="terminal-dot green-dot"></div>
        <span class="terminal-title">guides — bash</span>
      </div>
      <div class="terminal-body">
        <div class="terminal-line">
          <span class="terminal-prompt">$</span>
          <span><span class="terminal-cmd">guides</span> <span class="terminal-flag">--info</span></span>
        </div>
        <div class="terminal-blank"></div>
        <div class="terminal-line">
          <span class="terminal-prompt">→</span>
          <span class="terminal-output">OS &amp; Installation Guides</span>
        </div>
        <div class="terminal-line">
          <span class="terminal-prompt">→</span>
          <span class="terminal-output">Practical guides for problems that are hard to find solutions for online.</span>
        </div>
        <div class="terminal-blank"></div>
        <div class="terminal-line">
          <span class="terminal-prompt">$</span>
          <span><span class="terminal-cmd">guides</span> <span class="terminal-flag">--count</span></span>
        </div>
        <div class="terminal-line">
          <span class="terminal-prompt">→</span>
          <span class="terminal-output"><span class="terminal-value">${totalGuides}</span> guides across <span class="terminal-value">${SECTIONS.filter(s=>s.guides.length).length}</span> sections</span>
        </div>
        <div class="terminal-blank"></div>
        <div class="terminal-line">
          <span class="terminal-prompt">$</span>
          <span class="terminal-comment"># use the sidebar or search (⌘K) to find a guide</span>
        </div>
        <div class="terminal-line">
          <span class="terminal-prompt">$</span>
          <span><span class="cursor">█</span></span>
        </div>
      </div>
    </div>

    <div class="stats-grid">${statsRows}</div>

    <div class="home-notices">
      <div class="notice warn">⚠ Read everything before typing any command. If you do not understand what a command does, you are not ready to run it.</div>
      <div class="notice info">📋 Guides are written from real experience and official docs — but some steps may differ depending on your hardware, OS version, or configuration. Cross-reference with official docs when something does not work.</div>
      <div class="notice clock">🕐 Some guides may no longer reflect the current state of the software. If a guide feels off, check the official source first.</div>
    </div>
  `;
}

// ===== SECTION =====
function showSection(sectionId) {
  const section = SECTIONS.find(s => s.id === sectionId);
  if (!section) { showHome(); return; }
  document.title = `${section.title} — OS & Installation Guides`;
  openSection(sectionId);

  const rows = section.guides.map(g => `
    <a href="/guide/${g.slug}" onclick="event.preventDefault(); navigate('/guide/${g.slug}')"
       style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;
              border-bottom:1px solid var(--border-muted);text-decoration:none;
              transition:background .1s;"
       onmouseover="this.style.background='var(--bg-hover)'"
       onmouseout="this.style.background=''">
      <span style="font-size:12px;color:var(--text)">${g.title}</span>
      <span style="font-size:11px;color:var(--text-dim)">→</span>
    </a>
  `).join('');

  document.getElementById('main-content').innerHTML = `
    <div class="guide-breadcrumb">
      <a href="/" onclick="event.preventDefault(); navigate('/')">~</a>
      <span>/</span>
      <span style="color:var(--accent)">${section.title.toLowerCase().replace(/ /g,'-')}/</span>
    </div>
    <div class="guide-content">
      <h1>${section.title} <span style="font-size:13px;color:var(--text-muted);font-weight:400">(${section.guides.length} guides)</span></h1>
      <div style="background:var(--bg-card);border:1px solid var(--border);">${rows}</div>
    </div>
  `;
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
  content.innerHTML = '<div style="padding:48px 0;color:var(--text-dim);font-size:12px">loading...</div>';

  try {
    const resp = await fetch(`/guides/${slug}.html`);
    if (!resp.ok) throw new Error();
    const raw = await resp.text();
    const html = raw.split('\n').slice(1).join('\n');

    const sectionPath = section
      ? `<a href="/section/${section.id}" onclick="event.preventDefault(); navigate('/section/${section.id}')">${section.title.toLowerCase().replace(/ /g,'-')}</a>`
      : `<span>${guide.parent}</span>`;

    content.innerHTML = `
      <div class="guide-breadcrumb">
        <a href="/" onclick="event.preventDefault(); navigate('/')">~</a>
        <span>/</span>
        ${sectionPath}
        <span>/</span>
        <span style="color:var(--text-muted)">${slug}</span>
      </div>
      <div class="guide-content" id="guide-body">${html}</div>
      <div id="guide-nav-placeholder"></div>
    `;

    addCopyButtons();
    buildGuideNav(slug, section);
    window.scrollTo(0, 0);
  } catch(e) {
    content.innerHTML = `
      <div style="padding:40px 0">
        <div style="font-size:12px;color:var(--red);margin-bottom:8px">error: guide not found — ${slug}</div>
        <a href="/" onclick="event.preventDefault();navigate('/')" style="font-size:12px;color:var(--accent)">cd ~/</a>
      </div>`;
  }
}

// ===== GUIDE NAV =====
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
        <div class="guide-nav-label">← PREV</div>
        <div class="guide-nav-title">${prev.title}</div></a>` : '<div></div>'}
      ${next ? `<a class="guide-nav-link next" href="/guide/${next.slug}" onclick="event.preventDefault();navigate('/guide/${next.slug}')">
        <div class="guide-nav-label">NEXT →</div>
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
    btn.textContent = 'copy';
    btn.onclick = () => {
      navigator.clipboard.writeText(pre.querySelector('code')?.textContent || pre.textContent).then(() => {
        btn.textContent = 'copied!';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = 'copy'; btn.classList.remove('copied'); }, 1500);
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
    const matches = ALL_GUIDES.filter(g =>
      g.title.toLowerCase().includes(q) || (g.preview && g.preview.toLowerCase().includes(q))
    ).slice(0, 10);
    results.innerHTML = matches.length === 0
      ? `<div class="search-no-results">no results for "${q}"</div>`
      : matches.map(g => `
          <a class="search-result-item" href="/guide/${g.slug}"
             onclick="event.preventDefault();closeSearch();navigate('/guide/${g.slug}')">
            <div class="search-result-title">${highlight(g.title, q)}</div>
            <div class="search-result-section">${g.parent.toLowerCase()}</div>
          </a>`).join('');
    results.classList.add('open');
    overlay.classList.add('open');
  });

  input.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });
  overlay.addEventListener('click', closeSearch);
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); input.focus(); input.select(); }
  });
}

function highlight(text, q) {
  return text.replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
    '<mark style="background:rgba(0,255,135,0.2);color:var(--accent);border-radius:2px">$1</mark>');
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
