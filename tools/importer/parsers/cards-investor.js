/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-investor variant.
 * Base block: cards
 * Source: https://www.abbvie.com/
 * Selector: .grid:has(.cardpagestory.card-dashboard.medium-theme):has(.dashboard-card_link__list)
 *
 * Two cards: quarterly earnings card + investor link card.
 * Cards block: 2 columns per row (image | text). Each row = one card.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Card 1: Quarterly earnings card - found in .cardpagestory.card-dashboard
  const earningsCard = element.querySelector('.cardpagestory.card-dashboard');
  if (earningsCard) {
    const eyebrow = earningsCard.querySelector('.card-eyebrow');
    const title = earningsCard.querySelector('.card-title, h4');
    const cta = earningsCard.querySelector('.card-cta');
    const link = earningsCard.querySelector('a[href]');

    const textContent = [];
    if (eyebrow) {
      const p = document.createElement('p');
      p.innerHTML = `<em>${eyebrow.textContent.trim()}</em>`;
      textContent.push(p);
    }
    if (title) textContent.push(title);
    if (cta && link) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = cta.textContent.trim();
      textContent.push(a);
    }

    cells.push(['', textContent]);
  }

  // Card 2: Investor link card - found in .dashboardcards .dashboard-card_link__list
  const linkCard = element.querySelector('.dashboardcards .dashboard-card_link__list');
  if (linkCard) {
    const eyebrow = linkCard.querySelector('.linkcard-eyebrow');
    const title = linkCard.querySelector('.linkcard-title, h5');
    const links = linkCard.querySelectorAll('.linkcard-link');

    const textContent = [];
    if (eyebrow) {
      const p = document.createElement('p');
      p.innerHTML = `<em>${eyebrow.textContent.trim()}</em>`;
      textContent.push(p);
    }
    if (title) textContent.push(title);
    links.forEach((lnk) => {
      const linkText = lnk.querySelector('.link-text');
      const a = document.createElement('a');
      a.href = lnk.href;
      a.textContent = linkText ? linkText.textContent.trim() : lnk.textContent.trim();
      const p = document.createElement('p');
      p.appendChild(a);
      textContent.push(p);
    });

    cells.push(['', textContent]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-investor', cells });
  element.replaceWith(block);
}
