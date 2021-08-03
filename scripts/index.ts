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

interface Document {
  title: string;
  filename: string; // without extension
  html: string;
  breadcrumbs: string[]; // without extension
  children: Document[];
}

(async () => {
  const WEBSITE_DOMAIN = 'https://wikiwikiwi.vercel.app';
  const MARKDOWN_DIRECTORY_PATH: string = path.join(__dirname, '../docs');
  const DIST_DIRECTORY_PATH: string = path.join(__dirname, '../build');
  const TEMPLATE_FILE_PATH: Buffer = await fs.readFile(path.join(__dirname, './index.ejs'));
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
      delimiters: 'gitlab',
      macros: { '\\RR': '\\mathbb{R}' },
    })
    .use(mdAnchor)
    .use(mdTableOfContents, {
      includeLevel: [2, 3, 4],
      format: (content: string) => content.replace(/\[\^.*\]/, ''),
    })
    .use(mdCheckbox, {
      disabled: true,
    });

    const writtenFiles: string[] = [];
    const sitemapUrls: string[] = [];

    // https://github.com/johngrib/johngrib-jekyll-skeleton/blob/v1.0/_includes/createLink.html
    const linkRegex = /\[\[(.+?)\]\]/g;
    const labeledLinkRegex = /\[\[(.+?)\]\]\{(.+?)\}/g;

    const findInternalLinks = (markdown: string): string[] => {
      return [
        ...new Set([
          ...markdown.match(linkRegex)?.map((link) => link.replace(/(\[\[)|(\]\])/g, '')) || [],
          ...markdown.match(labeledLinkRegex)?.map((link) => link.replace(/(\[\[)|(\]\])|({(.+?)})/g, '')) || [],
        ])
      ];
    };
    
    const writeHtmlFromMarkdown = async (filename: string, breadcrumbs: string[]) => {
      writtenFiles.push(filename);

      const preContents = '[[toc]]\n\n';
      const markdown = (await fs.readFile(`${MARKDOWN_DIRECTORY_PATH}/${filename}.md`)).toString();

      const html = md.render(`${preContents}${markdown}`)
        .replace(labeledLinkRegex, '<a href="./$1.html">$2</a>')
        .replace(linkRegex, '<a href="./$1.html">$1</a>');

      const links = findInternalLinks(markdown);
      const children = await Promise.all(
        links.filter((link) => !writtenFiles.includes(link))
          .map(async (link) => writeHtmlFromMarkdown(link, [...breadcrumbs, link]))
      );

      const document: Document = { title: markdown.match(/^#\s.*/)[0].replace(/^#\s/, ''), filename, html, breadcrumbs, children };

      fs.writeFile(`${DIST_DIRECTORY_PATH}/${filename}.html`, ejs.render(String(TEMPLATE_FILE_PATH), { document }));
      sitemapUrls.push(`<url><loc>${WEBSITE_DOMAIN}/${filename}.html</loc><changefreq>daily</changefreq><priority>1.00</priority></url>`);

      return document;
    };

    await writeHtmlFromMarkdown('index', []);

    fs.writeFile(
      SITEMAP_PATH,
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<url><loc>${WEBSITE_DOMAIN}/</loc><lastmod>${dayjs().format('YYYY-MM-DDTHH:mm:ss')}+00:00</lastmod><changefreq>daily</changefreq><priority>1.00</priority></url>
${sitemapUrls.join('\n')}
</urlset>`,
    );
})();
