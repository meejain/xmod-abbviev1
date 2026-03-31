/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-media variant.
 * Base block: columns
 * Source: https://www.abbvie.com/
 * Selector: .container.abbvie-container:has(#title-d74551ecff)
 *
 * Two-column layout: podcast image on left, text content on right.
 * Columns block: 1 row with 2 cells.
 */
export default function parse(element, { document }) {
  const col1Content = [];
  const col2Content = [];

  // Column 1: Podcast image - found in .grid-row__col-with-3 .cmp-image__image
  const image = element.querySelector('.cmp-image__image, .cmp-image img, img');
  if (image) col1Content.push(image);

  // Column 2: Text content
  // Eyebrow - found in .cmp-header__text
  const eyebrow = element.querySelector('.cmp-header__text');
  if (eyebrow) {
    const p = document.createElement('p');
    p.innerHTML = `<em>${eyebrow.textContent.trim()}</em>`;
    col2Content.push(p);
  }

  // Title - found in .cmp-title__text h5
  const title = element.querySelector('.cmp-title__text, h5, h4, h3');
  if (title) col2Content.push(title);

  // Description - found in .cmp-text p
  const desc = element.querySelector('.cmp-text p, .cmp-text');
  if (desc) col2Content.push(desc);

  // CTA link - found in a.cmp-button
  const cta = element.querySelector('a.cmp-button, .button a');
  if (cta) col2Content.push(cta);

  const cells = [];
  cells.push([col1Content, col2Content]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-media', cells });
  element.replaceWith(block);
}
