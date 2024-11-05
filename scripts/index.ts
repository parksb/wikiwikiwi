import * as ejs from 'ejs';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as dayjs from 'dayjs';

import * as MarkdownIt from 'markdown-it';
import * as katex from 'katex';
import * as highlightJs from 'highlight.js';
import * as mdFootnote from 'markdown-it-footnote';
import * as mdTex from 'markdown-it-texmath';
import * as mdAnchor from 'markdown-it-anchor';
import * as mdTableOfContents from 'markdown-it-table-of-contents';
import * as mdInlineComment from 'markdown-it-inline-comments';
import * as mdCheckbox from 'markdown-it-task-checkbox';
import * as mdEmoji from 'markdown-it-emoji';
import mdMermaid from 'markdown-it-mermaid';
import * as mdExternalLink from 'markdown-it-external-links';

const Denque = require('denque');

interface Document {
  title: string;
  filename: string; // without extension
  html: string;
  breadcrumbs: string[]; // without extension
  children: Document[];
}

interface SearchIndex {
  title: string;
  filename: string; // without extension
  text: string;
}

(async () => {
  const WEBSITE_DOMAIN = 'https://wikiwikiwi.vercel.app';
  const MARKDOWN_DIRECTORY_PATH: string = path.join(__dirname, '../docs');
  const DIST_DIRECTORY_PATH: string = path.join(__dirname, '../build');
  const TEMPLATE_FILE_PATH: Buffer = await fs.readFile(path.join(__dirname, './index.ejs'));
  const SEARCH_TEMPLATE_FILE_PATH: Buffer = await fs.readFile(path.join(__dirname, './search.ejs'));
  const SITEMAP_PATH = `${DIST_DIRECTORY_PATH}/sitemap.xml`;

  const md: MarkdownIt = new MarkdownIt({
    html: false,
    xhtmlOut: false,
    breaks: false,
    langPrefix: 'language-',
    linkify: true,
    typographer: true,
    quotes: '“”‘’',
    highlight: (str, lang) => {
      if (lang && highlightJs.getLanguage(lang)) {
        return `<pre class="hljs"><code>${highlightJs.highlight(lang, str, true).value}</code></pre>`;
      }
      return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
    },
  }).use(mdFootnote)
    .use(mdInlineComment)
    .use(mdMermaid)
    .use(mdEmoji)
    .use(mdTex, {
      engine: katex,
      delimiters: 'dollars',
      macros: { '\\RR': '\\mathbb{R}' },
    })
    .use(mdAnchor)
    .use(mdTableOfContents, {
      includeLevel: [2, 3, 4],
      format: (content: string) => content.replace(/\[\^.*\]/, ''),
    })
    .use(mdCheckbox, {
      disabled: true,
    })
    .use(mdExternalLink, {
      externalClassName: 'external',
      internalDomains: ['wikiwikiwi.vercel.app'],
    });

    const sitemapUrls: string[] = [];
    const searchIndices: SearchIndex[] =[];

    // https://github.com/johngrib/johngrib-jekyll-skeleton/blob/v1.0/_includes/createLink.html
    const linkRegex = /\[\[(.+?)\]\]/g;
    const labeledLinkRegex = /\[\[(.+?)\]\]\{(.+?)\}/g;

    const findInternalFilenames = (markdown: string): string[] => {
      return [
        ...new Set([
          ...markdown.match(linkRegex)?.map((link) => link.replace(/(\[\[)|(\]\])/g, '')) || [],
          ...markdown.match(labeledLinkRegex)?.map((link) => link.replace(/(\[\[)|(\]\])|({(.+?)})/g, '')) || [],
        ])
      ];
    };

    const queue = new Denque([{ filename: 'index', breadcrumbs: [] }]);
    const writtenFiles: Set<string> = new Set(['index']);

    while (queue.length > 0) {
      const { filename, breadcrumbs } = queue.shift();

      const preContents = '[[toc]]\n\n';
      const markdown = (await fs.readFile(`${MARKDOWN_DIRECTORY_PATH}/${filename}.md`)).toString();
      const html = md.render(`${preContents}${markdown}`)
        .replace(labeledLinkRegex, '<a href="./$1.html">$2</a>')
        .replace(linkRegex, '<a href="./$1.html">$1</a>');
      const title = markdown.match(/^#\s.*/)[0].replace(/^#\s/, '');
      const document: Document = { title, filename, html, breadcrumbs: [...breadcrumbs, { title, filename }], children: [] };

      const searchIndex: SearchIndex = { title: document.title, filename, text: markdown };
      searchIndices.push(searchIndex);

      fs.writeFile(`${DIST_DIRECTORY_PATH}/${filename}.html`, ejs.render(String(TEMPLATE_FILE_PATH), { document }));
      sitemapUrls.push(`<url><loc>${WEBSITE_DOMAIN}/${filename}.html</loc><changefreq>daily</changefreq><priority>1.00</priority></url>`);

      for (const internalFilename of findInternalFilenames(markdown)) {
        if (!writtenFiles.has(internalFilename)) {
          queue.push({ filename: internalFilename, breadcrumbs: document.breadcrumbs });
          writtenFiles.add(internalFilename);
        }
      }
    }

    fs.writeFile(`${DIST_DIRECTORY_PATH}/search.html`, ejs.render(String(SEARCH_TEMPLATE_FILE_PATH), { document: JSON.stringify(searchIndices) }));

    fs.writeFile(
      SITEMAP_PATH,
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<url><loc>${WEBSITE_DOMAIN}/</loc><lastmod>${dayjs().format('YYYY-MM-DDTHH:mm:ss')}Z</lastmod><changefreq>daily</changefreq><priority>1.00</priority></url>
${sitemapUrls.join('\n')}
</urlset>`,
    );
})();
