#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const SECTIONS = [
  { id: 'macos',            title: 'macOS',                 parent: 'macOS' },
  { id: 'linux',            title: 'Linux',                 parent: 'Linux' },
  { id: 'common',           title: 'Common',                parent: 'Common' },
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

const sections = SECTIONS.map(s => ({ ...s, guides: [] }));
const allGuides = [];

fs.readdirSync(guidesDir)
  .filter(f => f.endsWith('.html'))
  .sort()
  .forEach(fname => {
    const content = fs.readFileSync(path.join(guidesDir, fname), 'utf8');
    const lines   = content.split('\n');

    // Line 1: <!-- sectionid:parent -->
    const metaMatch = lines[0].match(/^<!--\s*([^:]+):(.+?)\s*-->$/);
    if (!metaMatch) return;

    const sectionId = metaMatch[1].trim();
    const parent    = metaMatch[2].trim();

    // Line 2: <h1>Title</h1>
    const titleMatch = lines[1].match(/^<h1>(.*?)<\/h1>$/);
    if (!titleMatch) return;

    const title = titleMatch[1].trim();
    const slug  = fname.replace('.html', '');
    const preview = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200);

    const guide = { title, slug, parent, nav: 999, preview };
    const sec   = sections.find(s => s.id === sectionId);
    if (sec) sec.guides.push(guide);
    allGuides.push(guide);
  });

sections.forEach(s => s.guides.sort((a, b) => a.title.localeCompare(b.title)));

fs.writeFileSync(outputFile,
  `const SECTIONS = ${JSON.stringify(sections)};\nconst ALL_GUIDES = ${JSON.stringify(allGuides)};\n`
);

console.log(`guides-data.js: ${allGuides.length} guides`);
sections.filter(s => s.guides.length).forEach(s => console.log(`  ${s.title}: ${s.guides.length}`));
