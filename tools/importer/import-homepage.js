/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroVideoParser from './parsers/hero-video.js';
import columnsNewsParser from './parsers/columns-news.js';
import embedVideoParser from './parsers/embed-video.js';
import cardsStatsParser from './parsers/cards-stats.js';
import columnsMediaParser from './parsers/columns-media.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import heroCtaParser from './parsers/hero-cta.js';
import cardsInvestorParser from './parsers/cards-investor.js';
import cardsEsgParser from './parsers/cards-esg.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/abbvie-cleanup.js';
import sectionsTransformer from './transformers/abbvie-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-video': heroVideoParser,
  'columns-news': columnsNewsParser,
  'embed-video': embedVideoParser,
  'cards-stats': cardsStatsParser,
  'columns-media': columnsMediaParser,
  'columns-feature': columnsFeatureParser,
  'hero-cta': heroCtaParser,
  'cards-investor': cardsInvestorParser,
  'cards-esg': cardsEsgParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'AbbVie corporate homepage with hero, featured content, and company information',
  urls: [
    'https://www.abbvie.com/'
  ],
  blocks: [
    {
      name: 'hero-video',
      instances: ['.cmp-home-hero']
    },
    {
      name: 'columns-news',
      instances: ['.grid.cmp-grid-custom.no-bottom-margin:has(.carousel.cmp-carousel--rss)']
    },
    {
      name: 'embed-video',
      instances: ['.video.cmp-video-xx-large']
    },
    {
      name: 'cards-stats',
      instances: ['.grid:has(.cardpagestory.card-dashboard):has(.dashboardcards.medium-theme)']
    },
    {
      name: 'columns-media',
      instances: ['.container.abbvie-container:has(#title-d74551ecff)']
    },
    {
      name: 'columns-feature',
      instances: ['.grid.cmp-grid-custom.no-bottom-margin:has(#button-2e6b619938)']
    },
    {
      name: 'hero-cta',
      instances: ['#container-fccf146707']
    },
    {
      name: 'cards-investor',
      instances: ['.grid:has(.cardpagestory.card-dashboard.medium-theme):has(.dashboard-card_link__list)']
    },
    {
      name: 'cards-esg',
      instances: ['#container-3a42f76c63']
    }
  ],
  sections: [
    {
      id: 'section-hero',
      name: 'Hero',
      selector: '.homepage-hero-controller',
      style: null,
      blocks: ['hero-video'],
      defaultContent: []
    },
    {
      id: 'section-news',
      name: 'News and Featured',
      selector: '.homepage-overlap',
      style: null,
      blocks: ['columns-news'],
      defaultContent: []
    },
    {
      id: 'section-patients',
      name: 'Patients',
      selector: '.teaser:has(.cmp-teaser__pretitle:empty) + .video',
      style: null,
      blocks: [],
      defaultContent: ['.cmp-teaser:has(.cmp-teaser__title):not([id])']
    },
    {
      id: 'section-video',
      name: 'Video',
      selector: '.video.cmp-video-xx-large',
      style: null,
      blocks: ['embed-video'],
      defaultContent: []
    },
    {
      id: 'section-science',
      name: 'Science and Innovation',
      selector: '#teaser-a2987e48b8',
      style: null,
      blocks: ['cards-stats'],
      defaultContent: ['#teaser-a2987e48b8']
    },
    {
      id: 'section-podcast',
      name: 'Podcast',
      selector: '.container.abbvie-container:has(#title-d74551ecff)',
      style: null,
      blocks: ['columns-media'],
      defaultContent: []
    },
    {
      id: 'section-culture',
      name: 'Culture of Curiosity',
      selector: '#section02',
      style: null,
      blocks: ['columns-feature'],
      defaultContent: ['#section02']
    },
    {
      id: 'section-cta',
      name: 'Explore Opportunities',
      selector: '.container.abbvie-container.medium-radius:has(#container-fccf146707)',
      style: 'dark',
      blocks: ['hero-cta'],
      defaultContent: []
    },
    {
      id: 'section-investors',
      name: 'Investor Resources',
      selector: '#section03',
      style: null,
      blocks: ['cards-investor'],
      defaultContent: ['#section03']
    },
    {
      id: 'section-esg',
      name: 'ESG',
      selector: '#section04',
      style: null,
      blocks: ['cards-esg'],
      defaultContent: ['#section04']
    }
  ]
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null,
          });
        });
      } catch (e) {
        console.warn(`Block "${blockDef.name}" selector error: ${selector}`, e);
      }
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
