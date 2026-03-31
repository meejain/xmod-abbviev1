/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-feature variant.
 * Base block: columns
 * Source: https://www.abbvie.com/
 * Selector: .grid.cmp-grid-custom.no-bottom-margin:has(#button-2e6b619938)
 *
 * Three equal columns, each with tall image, description text, and CTA button.
 * Columns block: 1 row with 3 cells.
 */
export default function parse(element, { document }) {
  const gridCells = element.querySelectorAll('.grid-row__col-with-4.grid-cell');
  const columnContents = [];

  gridCells.forEach((cell) => {
    const colContent = [];

    // Image - found in .cmp-image__image
    const img = cell.querySelector('.cmp-image__image, .cmp-image img, img');
    if (img) colContent.push(img);

    // Description text - found in .cmp-text p
    const desc = cell.querySelector('.cmp-text p, .cmp-text');
    if (desc) colContent.push(desc);

    // CTA link - found in a.cmp-button
    const cta = cell.querySelector('a.cmp-button, .button a');
    if (cta) colContent.push(cta);

    if (colContent.length > 0) columnContents.push(colContent);
  });

  const cells = [];
  if (columnContents.length > 0) {
    cells.push(columnContents);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
