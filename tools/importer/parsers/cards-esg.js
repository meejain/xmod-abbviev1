/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-esg variant.
 * Base block: cards
 * Source: https://www.abbvie.com/
 * Selector: #container-3a42f76c63
 *
 * ESG section with background image, stat card, ESG nav card, and quick links card.
 * Cards block: 2 columns per row (image | text). Each row = one card.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Card 1: Stat card - found in .dashboardcards.hide-image .dashboard-card-facts
  const statCard = element.querySelector('.dashboardcards.hide-image .dashboard-card-facts');
  if (statCard) {
    const eyebrow = statCard.querySelector('.eyebrow');
    const dataPoint = statCard.querySelector('.data-point');
    const dataSuffix = statCard.querySelector('.data-point-suffix');
    const description = statCard.querySelector('.description');

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
  }

  // Card 2: ESG navigation card - found in .cardpagestory within this container
  const esgCard = element.querySelector('.cardpagestory');
  if (esgCard) {
    const img = esgCard.querySelector('.card-image, img');
    const eyebrow = esgCard.querySelector('.card-eyebrow');
    const title = esgCard.querySelector('.card-title, h4');
    const desc = esgCard.querySelector('.card-description');
    const cta = esgCard.querySelector('.card-cta');
    const link = esgCard.querySelector('a[href]');

    const textContent = [];
    if (eyebrow) {
      const p = document.createElement('p');
      p.innerHTML = `<em>${eyebrow.textContent.trim()}</em>`;
      textContent.push(p);
    }
    if (title) textContent.push(title);
    if (desc) textContent.push(desc);
    if (cta && link) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = cta.textContent.trim();
      textContent.push(a);
    }

    cells.push([img || '', textContent]);
  }

  // Card 3: Quick links card - found in .dashboardcards.light-theme-no-stroke .dashboard-card_link__list
  const linkCard = element.querySelector('.dashboardcards.light-theme-no-stroke .dashboard-card_link__list');
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-esg', cells });
  element.replaceWith(block);
}
