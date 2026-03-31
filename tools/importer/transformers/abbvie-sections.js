/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AbbVie section breaks and section-metadata.
 * Adds section breaks (<hr>) and section-metadata blocks based on template sections.
 * Runs in afterTransform only, uses payload.template.sections.
 * Uses two-pass lookup: original DOM selectors first, then block class names as fallback.
 * Selectors from captured DOM of https://www.abbvie.com/
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const template = payload && payload.template;
    if (!template || !template.sections || template.sections.length < 2) return;

    const sections = template.sections;
    const document = element.ownerDocument;

    // Process sections in reverse order to avoid DOM position shifts
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];

      let sectionEl = null;

      // Pass 1: Try original section selector
      const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];
      for (const sel of selectorList) {
        try {
          sectionEl = element.querySelector(sel);
        } catch (e) { /* ignore invalid selectors */ }
        if (sectionEl) break;
      }

      // Pass 2: Fall back to finding the first block table by class name
      if (!sectionEl && section.blocks && section.blocks.length > 0) {
        for (const blockName of section.blocks) {
          try {
            sectionEl = element.querySelector(`.${blockName}`);
          } catch (e) { /* ignore */ }
          if (sectionEl) break;
        }
      }

      // Pass 3: Try default content selectors
      if (!sectionEl && section.defaultContent && section.defaultContent.length > 0) {
        for (const sel of section.defaultContent) {
          try {
            sectionEl = element.querySelector(sel);
          } catch (e) { /* ignore */ }
          if (sectionEl) break;
        }
      }

      if (!sectionEl) continue;

      // Add section-metadata block if section has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(metaBlock);
      }

      // Add <hr> before each section except the first
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
