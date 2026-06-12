#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const SECTIONS = [
  { id: 'macos',            title: 'macOS',                 parent: 'macOS' },
  { id: 'linux',            title: 'Linux',                 parent: 'Linux' },
  { id: 'system-users',     title: 'System & Users',        parent: 'System & Users' },
  { id: 'package-managers', title: 'Package Managers',      parent: 'Package Managers (All OSes)' },
  { id: 'networking',       title: 'Networking & DNS',      parent: 'Networking & DNS' },
  { id: 'security',         title: 'Security & Apps',       parent: 'Security & Apps' },
  { id: 'scheduling',       title: 'Task Scheduling',       parent: 'Task Scheduling' },
  { id: 'server',           title: 'Server & Self-Hosting', parent: 'Server & Self-Hosting' },
  { id: 'windows',          title: 'Windows',               parent: 'Windows' },
  { id: 'installation',     title: 'Installation Guides',   parent: 'Installation Guides' },
];

const guidesDir  = path.join(__dirname, 'guides');
const outputFile = path.join(__dirname, 'js', 'guides-data.js');
const knownParents = SECTIONS.map(s => s.parent);

const sections = SECTIONS.map(s => ({ ...s, guides: [] }));
const allGuides = [];

fs.readdirSync(guidesDir)
  .filter(f => f.endsWith('.html'))
  .sort()
  .forEach(fname => {
    const content = fs.readFileSync(path.join(guidesDir, fname), 'utf8');
    const firstLine = content.split('\n')[0].trim();
    if (!firstLine.startsWith('DATA:')) return;

    const withoutPrefix = firstLine.slice(5);
    const firstColon = withoutPrefix.indexOf(':');
    if (firstColon === -1) return;

    const sectionId = withoutPrefix.slice(0, firstColon);
    const rest = withoutPrefix.slice(firstColon + 1);

    let title = '', parent = '';
    for (const p of knownParents) {
      if (rest.endsWith(':' + p)) {
        title = rest.slice(0, rest.length - p.length - 1);
        parent = p;
        break;
      }
    }
    if (!title && !parent) {
      const lastColon = rest.lastIndexOf(':');
      title = rest.slice(0, lastColon);
      parent = rest.slice(lastColon + 1);
    }
    if (!title || !parent) return;

    const preview = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200);
    const slug = fname.replace('.html', '');
    const guide = { title, slug, parent, nav: 999, preview };

    const sec = sections.find(s => s.id === sectionId);
    if (sec) sec.guides.push(guide);
    allGuides.push(guide);
  });

sections.forEach(s => s.guides.sort((a, b) => a.title.localeCompare(b.title)));

fs.writeFileSync(outputFile,
  `const SECTIONS = ${JSON.stringify(sections)};\nconst ALL_GUIDES = ${JSON.stringify(allGuides)};\n`
);

console.log(`guides-data.js: ${allGuides.length} guides`);
sections.filter(s => s.guides.length).forEach(s => console.log(`  ${s.title}: ${s.guides.length}`));
