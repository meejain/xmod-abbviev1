/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-stats variant.
 * Base block: cards
 * Source: https://www.abbvie.com/
 * Selector: .grid:has(.cardpagestory.card-dashboard):has(.dashboardcards.medium-theme)
 *
 * Mixed card grid: story card with image + stat/fact cards.
 * Cards block: 2 columns per row (image | text). Each row = one card.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Card 1: Story card - found in .cardpagestory.card-dashboard
  const storyCard = element.querySelector('.cardpagestory.card-dashboard');
  if (storyCard) {
    const img = storyCard.querySelector('.card-image, img');
    const eyebrow = storyCard.querySelector('.card-eyebrow');
    const title = storyCard.querySelector('.card-title, h4, h3');
    const cta = storyCard.querySelector('.card-cta, a');

    const textContent = [];
    if (eyebrow) {
      const p = document.createElement('p');
      p.innerHTML = `<em>${eyebrow.textContent.trim()}</em>`;
      textContent.push(p);
    }
    if (title) textContent.push(title);
    if (cta) {
      const link = storyCard.querySelector('a[href]');
      if (link) {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = cta.textContent.trim();
        textContent.push(a);
      }
    }

    cells.push([img || '', textContent]);
  }

  // Card 2 & 3: Stat/fact cards - found in .dashboardcards .dashboard-card-facts
  const statCards = element.querySelectorAll('.dashboardcards');
  statCards.forEach((card) => {
    const factsContainer = card.querySelector('.dashboard-card-facts');
    if (!factsContainer) return;

    const eyebrow = factsContainer.querySelector('.eyebrow');
    const dataPoint = factsContainer.querySelector('.data-point');
    const dataSuffix = factsContainer.querySelector('.data-point-suffix');
    const description = factsContainer.querySelector('.description');

    const textContent = [];
    if (eyebrow) {
      const p = document.createElement('p');
      p.innerHTML = `<em>${eyebrow.textContent.trim()}</em>`;
      textContent.push(p);
    }
    if (dataPoint) {
      const h = document.createElement('h2');
      h.textContent = dataPoint.textContent.trim() + (dataSuffix ? dataSuffix.textContent.trim() : '');
      textContent.push(h);
    }
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      textContent.push(p);
    }

    cells.push(['', textContent]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-stats', cells });
  element.replaceWith(block);
}
