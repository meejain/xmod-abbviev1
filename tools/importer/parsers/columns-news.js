/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-news variant.
 * Base block: columns
 * Source: https://www.abbvie.com/
 * Selector: .grid.cmp-grid-custom.no-bottom-margin:has(.carousel.cmp-carousel--rss)
 *
 * Two-column layout: press releases list on left, featured story card on right.
 * Columns block: 1 row with 2 cells (one per column).
 */
export default function parse(element, { document }) {
  // Column 1: Press releases carousel
  const pressReleasesCol = element.querySelector('.grid-row__col-with-6:has(.carousel), .grid-row__col-with-4:has(.carousel)');
  // Column 2: Featured story card
  const featuredCol = element.querySelector('.grid-row__col-with-6:has(.cardpagestory), .grid-row__col-with-8:has(.cardpagestory)');

  const col1Content = [];
  const col2Content = [];

  // Extract press releases header and links
  if (pressReleasesCol) {
    const header = pressReleasesCol.querySelector('.cmp-title__text, h4, h3');
    if (header) col1Content.push(header);

    const newsLinks = pressReleasesCol.querySelectorAll('.carousel-item a, .cmp-carousel__item a');
    newsLinks.forEach((link) => {
      const p = document.createElement('p');
      p.appendChild(link.cloneNode(true));
      col1Content.push(p);
    });

    // If no carousel links found, get any links in the section
    if (newsLinks.length === 0) {
      const allLinks = pressReleasesCol.querySelectorAll('a');
      allLinks.forEach((link) => {
        const p = document.createElement('p');
        p.appendChild(link.cloneNode(true));
        col1Content.push(p);
      });
    }
  }

  // Extract featured story card
  if (featuredCol) {
    const cardImage = featuredCol.querySelector('.card-image, img');
    if (cardImage) col2Content.push(cardImage);

    const eyebrow = featuredCol.querySelector('.card-eyebrow, .card-metadata-tag');
    if (eyebrow) {
      const p = document.createElement('p');
      p.textContent = eyebrow.textContent.trim();
      col2Content.push(p);
    }

    const title = featuredCol.querySelector('.card-title, h4, h3');
    if (title) col2Content.push(title);

    const desc = featuredCol.querySelector('.card-description, p');
    if (desc) col2Content.push(desc);

    const cta = featuredCol.querySelector('.card-cta, a');
    if (cta) {
      const link = document.createElement('a');
      link.href = cta.closest('a') ? cta.closest('a').href : (cta.href || '#');
      link.textContent = cta.textContent.trim() || 'Read story';
      col2Content.push(link);
    }
  }

  const cells = [];
  cells.push([col1Content, col2Content]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-news', cells });
  element.replaceWith(block);
}
