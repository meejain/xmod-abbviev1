/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-cta variant.
 * Base block: hero
 * Source: https://www.abbvie.com/
 * Selector: #container-fccf146707
 *
 * Dark CTA banner with heading, subtitle text, and browse jobs button.
 * Hero block: Row 1 = (no bg image), Row 2 = heading + text + CTA
 */
export default function parse(element, { document }) {
  // Extract heading - found in .cmp-title__text or h4 within dark-theme
  const heading = element.querySelector('.cmp-title__text, h4, h3, h2');

  // Extract description text - found in .cmp-text p
  const description = element.querySelector('.cmp-text p, .cmp-text');

  // Extract CTA link - found in a.cmp-button
  const ctaLink = element.querySelector('a.cmp-button, .button a');

  const cells = [];

  // Row 1: Content cell with heading + description + CTA
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (ctaLink) contentCell.push(ctaLink);
  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-cta', cells });
  element.replaceWith(block);
}
