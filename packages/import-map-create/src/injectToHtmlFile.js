import fs from 'fs';

/**
 * Injects the importmap with the following priority
 * 1. if found replaces an existing importmap
 * 2. if </head> is found it adds it right before
 * 3. adds it at the end of the file
 *
 * @param {String} filePath
 * @param {String} importMap
 */
export default function injectToHtmlFile(filePath, importMap) {
  let fileString = fs.readFileSync(filePath, 'utf-8');

  if (fileString.includes('<script type="importmap">')) {
    fileString = fileString.replace(
      /<script type="importmap">(.|\n)*?<\/script>/,
      `<script type="importmap">${importMap}</script>`,
    );
  } else if (fileString.includes('</head>')) {
    fileString = fileString.replace(
      '</head>',
      `<script type="importmap">${importMap}</script></head>`,
    );
  } else {
    fileString += `<script type="importmap">${importMap}</script>`;
  }

  fs.writeFileSync(filePath, fileString, 'utf-8');
}
