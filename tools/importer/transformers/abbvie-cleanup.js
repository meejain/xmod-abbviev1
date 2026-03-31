/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AbbVie cleanup.
 * Removes non-authorable content from AbbVie pages.
 * Selectors from captured DOM of https://www.abbvie.com/
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent banner (OneTrust) - found as #onetrust-consent-sdk
    // Remove any overlay/modal elements that block content parsing
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '.onetrust-pc-dark-filter',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove header experience fragment - found as .cmp-experiencefragment--header
    // Remove footer experience fragment - found as .cmp-experiencefragment--footer
    // Remove navigation - found as .navigation.frosted inside header XF
    // Remove back-to-top button - found as .button.back-to-top inside footer
    // Remove iframes, link tags, noscript
    // Remove popup/modal dialogs (warn on departure, cookie banners)
    WebImporter.DOMUtils.remove(element, [
      '.cmp-experiencefragment--header',
      '.cmp-experiencefragment--footer',
      'iframe',
      'link',
      'noscript',
      '.popup-overlay',
      '.popup-alert',
      '#popup-alert',
      '.cmp-popup',
      '[data-popup-type]',
    ]);

    // Remove tracking pixel images (Twitter, analytics, etc.)
    element.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (
        src.includes('t.co/') ||
        src.includes('analytics.twitter.com') ||
        src.includes('adsct') ||
        src.includes('c.bing.com') ||
        src.includes('pixel') ||
        src.startsWith('blob:')
      ) {
        img.remove();
      }
    });

    // Remove popup dialog text and buttons by matching content patterns
    const popupPatterns = [
      /^CLOSE$/i,
      /about to leave the AbbVie/i,
      /No,?\s*I disagree/i,
      /Yes,?\s*I agree/i,
      /product-specific site/i,
    ];
    element.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div').forEach((el) => {
      const text = el.textContent.trim();
      if (text && popupPatterns.some((pattern) => pattern.test(text)) && !el.querySelector('.cards-esg, .cards-investor, [class*="cards"], [class*="columns"], [class*="hero"]')) {
        el.remove();
      }
    });

    // Remove tracking/analytics attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
      el.removeAttribute('data-analytics');
    });
  }
}
