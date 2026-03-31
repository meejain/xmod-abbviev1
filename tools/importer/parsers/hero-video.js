/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-video variant.
 * Base block: hero
 * Source: https://www.abbvie.com/
 * Selector: .cmp-home-hero
 *
 * Hero block: Row 1 = background image, Row 2 = heading + CTA
 * Extracts from .cmp-home-hero__primary (active hero slide)
 */
export default function parse(element, { document }) {
  // Get the primary (active) hero slide
  const primarySlide = element.querySelector('.cmp-home-hero__primary');
  if (!primarySlide) return;

  // Extract background image from the hero slide
  const bgImage = primarySlide.querySelector('img');

  // Extract heading text - found in .cmp-home-hero__content h1, h2, or .cmp-title__text
  const heading = primarySlide.querySelector('.cmp-title__text, h1, h2');

  // Extract CTA link - found in .cmp-button or a with .cmp-button class
  const ctaLink = primarySlide.querySelector('a.cmp-button, .button a');

  const cells = [];

  // Row 1: Background image (optional per block library)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Heading + CTA content
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (ctaLink) contentCell.push(ctaLink);
  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-video', cells });
  element.replaceWith(block);
}
