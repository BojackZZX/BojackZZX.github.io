# Zexin Zheng — Personal Website

## Preview the website

Double-click `index.html` to open the website in your browser. Use the Home, CV, and Research links at the top to navigate between pages.

The website works offline without installing software or starting a server. SSRN links require an internet connection.

The CV page includes a first-page preview and links to open or download the complete PDF. Select **Open CV** to read the full document.

## Edit text and research papers

Website text is stored in `content.json`. Open it in Notepad or a code editor, edit the text inside quotation marks, and save the file. Then double-click `update-website.cmd` and refresh your browser.

- `profile`: Name, position, affiliation, email address, SSRN profile URL, and paths to the portrait and CV.
- `home`: Introduction, Ph.D. education, research interests, and research statement.
- `research.workingPapers`: Working papers, including links, coauthors, status, awards, presentations, and abstracts.
- `research.workInProgress`: Work in progress, without hyperlinks.
- `research.policyWorks`: Policy works, without hyperlinks.

JSON uses straight double quotation marks and commas. Preserve the field names and structure. Escape quotation marks within text as `\"`. To add a paper, copy a complete entry from the relevant section and separate entries with commas.

`update-website.cmd` uses the Node.js installation on your computer to regenerate the three HTML pages. Website visitors do not need Node.js. You can also ask Codex to update the pages for you.

Avoid editing the generated HTML files directly: the next update will overwrite those changes.

## Replace the portrait or CV

- **Portrait:** Replace `assets/headshot2.png`, keeping the same filename. The original image is 1024 × 1536 pixels and is displayed at its original aspect ratio, without cropping or stretching. If the replacement has different dimensions, update `photoWidth` and `photoHeight` in `content.json`, then regenerate the website.
- **CV:** Replace `assets/Zexin-Zheng-CV.pdf`, keeping the same filename. Then double-click `update-website.cmd` to refresh the first-page preview. The current computer has the required preview tool installed. On a computer without that tool, the update script keeps the PDF links and omits the preview image.
- The website uses the copies in this folder. It does not automatically synchronize with the original CV in Downloads or the original portrait elsewhere on your computer.

## Adjust colors and portrait size

Edit `styles.css`:

- `--accent: #203f68` sets the accent color to a deep blue similar to the CV headings.
- `--portrait-width: 280px` sets the portrait width for standard desktop windows; larger screens use 310px.
- In the mobile styles, `.portrait` uses `min(220px, 72%)` to keep the rectangular portrait prominent.
- Font sizes, spacing, and layout are also defined in this file. Refresh the browser after saving CSS changes; no rebuild is needed.

## Publish to GitHub Pages

These are static website files that can be hosted on GitHub Pages or another static hosting service.

Upload at least the following files, preserving their relative locations. Place `index.html` at the root of the publishing folder:

```text
index.html
research.html
cv.html
styles.css
.nojekyll
assets/
  headshot2.png
  Zexin-Zheng-CV.pdf
  cv-preview.png
  favicon.svg
```

You can also keep `content.json`, `build.mjs`, `update-website.cmd`, and this README in the repository for maintenance.

After editing `content.json`, regenerate the website locally before uploading the updated HTML files. When replacing the CV, upload both the new PDF and the refreshed preview image. Uploading `content.json` alone does not update the generated pages.

## Content and design notes

The website uses independently written HTML and CSS, with a simple academic layout inspired by the supplied reference screenshots.

- The homepage mentions only the Ph.D.; the CV uses the complete original PDF.
- Research content, ordering, and section names follow the supplied specifications. Abstracts are collapsed by default.
- The longer presentation list is grouped by 2026, 2025, and 2024, retaining all entries.
- The SSRN author profile was verified against the paper list: https://papers.ssrn.com/sol3/cf_dev/AbsByAuth.cfm?per_id=4319232
