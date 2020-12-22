import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';

import * as MarkdownIt from 'markdown-it';
import * as katex from 'katex';
import * as highlightJs from 'highlight.js';
import * as mdFootnote from 'markdown-it-footnote';
import * as mdTex from 'markdown-it-texmath';
import * as mdAnchor from 'markdown-it-anchor';
import * as mdTableOfContents from 'markdown-it-table-of-contents';
import * as mdInlineComment from 'markdown-it-inline-comments';

const MARKDOWN_DIRECTORY_PATH: string = path.join(__dirname, '../docs');
const HTML_DIRECTORY_PATH: string = path.join(__dirname, '../build');
const TEMPLATE_FILE_PATH: Buffer = fs.readFileSync(path.join(__dirname, './index.ejs'));

(() => {
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
    .use(mdTex.use(katex), {
      delimiters: 'gitlab',
    })
    .use(mdAnchor)
    .use(mdTableOfContents, {
      includeLevel: [1, 2, 3],
    });

    const articleFiles: string[] = fs.readdirSync(MARKDOWN_DIRECTORY_PATH)
    .filter((file) => !file.startsWith('.') );

    articleFiles.forEach((filename: string, index: number) => {
      const markdown = fs.readFileSync(`${MARKDOWN_DIRECTORY_PATH}/${filename}`).toString();
      const html = md.render(markdown) // https://github.com/johngrib/johngrib-jekyll-skeleton/blob/v1.0/_includes/createLink.html
        .replace(/\[\[(.+?)\]\]\{(.+?)\}/g, '<a href="$1.html">$2</a>')
        .replace(/\[\[(.+?)\]\]/g, '<a href="$1.html">$1</a>');
      const filenameWithoutExt = filename.replace('.md', '');
      const title = markdown.match(/^#\s.*/)[0].replace(/^#\s/, '');
      const document = { title, filename, filenameWithoutExt, html };

      fs.writeFileSync(
        `${HTML_DIRECTORY_PATH}/${filenameWithoutExt}.html`,
        ejs.render(String(TEMPLATE_FILE_PATH), { document }),
      );

      console.log(`* ${index}: ${filename}`);
    });
})();