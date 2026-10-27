// Edit content.json, then run `node build.mjs` or double-click update-website.cmd.
// No packages or installation are required. The generated pages also work offline.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { homedir } from 'node:os';
const root = path.dirname(fileURLToPath(import.meta.url));
const content = JSON.parse(await readFile(path.join(root, 'content.json'), 'utf8'));
const p = content.profile;
// Create a portable first-page preview; the original PDF remains the download.
// If Poppler is unavailable, the CV page still provides working PDF links.
let cvPreview = false;
const popplerCandidates = ['pdftoppm', path.join(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe')];
for (const executable of popplerCandidates) {
  try {
    execFileSync(executable, ['-f','1','-singlefile','-scale-to','1600','-png',path.join(root,p.cv),path.join(root,'assets/cv-preview')], {stdio:'pipe',windowsHide:true});
    cvPreview = true;
    break;
  } catch { /* Use the next installed renderer, or keep the PDF links only. */ }
}
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mailIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="m3 6 9 7 9-7"/></svg>';
const paperIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 12h7M9 16h7"/></svg>';
function shell(page, title, description, body) {
  const nav = [['home','Home','index.html'],['cv','CV','cv.html'],['research','Research','research.html']].map(([id,label,url]) => `<a href="${url}"${id === page ? ' aria-current="page"' : ''}>${label}</a>`).join('\n        ');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(title)}</title>
  <meta name="description" content="${escape(description)}">
  <meta name="theme-color" content="#203f68">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${escape(description)}">
  <meta property="og:type" content="website">
  <link rel="icon" href="assets/favicon.png" type="image/png" sizes="96x96">
  <link rel="stylesheet" href="styles.css">
</head>
<body class="page-${page}">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <nav class="navigation container" aria-label="Main navigation">
        ${nav}
    </nav>
  </header>
  <div class="layout container">
    <aside class="profile" aria-label="About ${escape(p.name)}">
      <img class="portrait" src="${escape(p.photo)}" width="${p.photoWidth}" height="${p.photoHeight}" alt="${escape(p.name)}" fetchpriority="high">
      <div class="profile-info">
        <p class="profile-name">${escape(p.name)}</p>
        <p class="profile-affiliation"><span class="profile-role">${escape(p.role)}</span><br>${escape(p.faculty)}<br>${escape(p.university)}</p>
        <ul class="contact-list" aria-label="Contact and research profile">
          <li><a href="mailto:${escape(p.email)}">${mailIcon}<span>Email <span class="email-address">(${escape(p.email)})</span></span></a></li>
          <li><a href="${escape(p.ssrn)}" target="_blank" rel="noopener noreferrer">${paperIcon}<span>SSRN<span class="sr-only"> (opens in a new tab)</span></span></a></li>
        </ul>
      </div>
    </aside>
    <main id="main" tabindex="-1">
${body}
    </main>
  </div>
</body>
</html>
`;
}
const h = content.home;
const home = `      <h1 class="welcome">${escape(h.greeting)}</h1>
      <div class="biography">
        <p>${escape(h.introduction)}</p>
        <p>${escape(h.education)}</p>
        <p>My <a href="research.html">research</a> focuses on <strong>${escape(h.interests[0].toLowerCase())}</strong> and <strong>${escape(h.interests[1].toLowerCase())}</strong>. ${escape(h.researchStatement)}</p>
      </div>`;
function workingPaper(paper, i) {
  const presentations = (paper.presentations ?? []).map(v => `<span class="presentation-entry">${v.year ? `<span class="presentation-year">${escape(v.year)}:</span> ` : ''}${escape(v.text)}</span>`).join('\n                ');
  return `        <article class="paper" aria-labelledby="paper-${i}">
          <h3 class="paper-title" id="paper-${i}"><a href="${escape(paper.url)}" target="_blank" rel="noopener noreferrer">${escape(paper.title)}</a></h3>
          <p class="coauthors">${escape(paper.authors)}</p>
          ${paper.status ? `<p class="paper-status">${escape(paper.status).replace(
  'Review of Financial Studies',
  '<strong>Review of Financial Studies</strong>'
)}</p>` : ''}
          <ul class="paper-notes">
            ${paper.awards ? `<li><span class="note-label">Awards:</span> ${escape(paper.awards)}</li>` : ''}
            ${presentations ? `<li><span class="note-label">Presentations:</span><div class="presentations">${presentations}</div></li>` : ''}
          </ul>
          <details class="abstract">
            <summary><span class="toggle-symbol" aria-hidden="true"></span>Abstract</summary>
            <p>${escape(paper.abstract)}</p>
          </details>
        </article>`;
}
function plainPaper(paper) {
  // These sections intentionally contain no hyperlinks.
  return `        <article class="paper compact-paper">
          <h3 class="paper-title">${escape(paper.title)}</h3>
          <p class="coauthors">${escape(paper.authors)}</p>
          ${paper.journal ? `<p class="publication"><cite>${escape(paper.journal)}</cite>, ${escape(paper.year)}</p>` : ''}
        </article>`;
}
const research = `      <h1 class="sr-only">Research</h1>
      <section class="research-section" aria-labelledby="working-papers">
        <h2 class="section-title" id="working-papers">Working Papers</h2>
${content.research.workingPapers.map(workingPaper).join('\n')}
      </section>
      <section class="research-section" aria-labelledby="work-in-progress">
        <h2 class="section-title" id="work-in-progress">Work in Progress</h2>
${content.research.workInProgress.map(plainPaper).join('\n')}
      </section>
      <section class="research-section" aria-labelledby="policy-works">
        <h2 class="section-title" id="policy-works">Policy Works</h2>
${content.research.policyWorks.map(plainPaper).join('\n')}
      </section>`;
const cv = `      <h1 class="section-title">Curriculum Vitae</h1>
      <div class="cv-actions">
        <a class="text-action" href="${escape(p.cv)}" target="_blank" rel="noopener">Open CV <span aria-hidden="true">↗</span><span class="sr-only"> (PDF, opens in a new tab)</span></a>
        <a class="text-action" href="${escape(p.cv)}" download="Zexin-Zheng-CV.pdf">Download PDF <span aria-hidden="true">↓</span></a>
      </div>
      ${cvPreview ? `<a class="cv-preview-link" href="${escape(p.cv)}" target="_blank" rel="noopener" aria-label="Open the complete curriculum vitae as a PDF"><img class="cv-preview" src="assets/cv-preview.png" alt="First page of ${escape(p.name)}'s curriculum vitae. Open the PDF for the complete, accessible document."></a><p class="cv-caption">First-page preview · <a href="${escape(p.cv)}" target="_blank" rel="noopener">View complete CV (PDF)</a></p>` : `<p><a href="${escape(p.cv)}">View the complete curriculum vitae (PDF).</a></p>`}`;
await Promise.all([
  writeFile(path.join(root,'index.html'), shell('home',p.name,`${p.name}, ${p.role}, ${p.university}. Research in information economics and financial intermediation.`,home)),
  writeFile(path.join(root,'research.html'), shell('research',`Research | ${p.name}`,`Working papers, work in progress, and policy works by ${p.name}.`,research)),
  writeFile(path.join(root,'cv.html'), shell('cv',`CV | ${p.name}`,`Curriculum vitae of ${p.name}.`,cv))
]);
console.log('Updated index.html, research.html, and cv.html.');
