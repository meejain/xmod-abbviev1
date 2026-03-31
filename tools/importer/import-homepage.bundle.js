var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-video.js
  function parse(element, { document }) {
    const primarySlide = element.querySelector(".cmp-home-hero__primary");
    if (!primarySlide) return;
    const bgImage = primarySlide.querySelector("img");
    const heading = primarySlide.querySelector(".cmp-title__text, h1, h2");
    const ctaLink = primarySlide.querySelector("a.cmp-button, .button a");
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (ctaLink) contentCell.push(ctaLink);
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-news.js
  function parse2(element, { document }) {
    const pressReleasesCol = element.querySelector(".grid-row__col-with-6:has(.carousel), .grid-row__col-with-4:has(.carousel)");
    const featuredCol = element.querySelector(".grid-row__col-with-6:has(.cardpagestory), .grid-row__col-with-8:has(.cardpagestory)");
    const col1Content = [];
    const col2Content = [];
    if (pressReleasesCol) {
      const header = pressReleasesCol.querySelector(".cmp-title__text, h4, h3");
      if (header) col1Content.push(header);
      const newsLinks = pressReleasesCol.querySelectorAll(".carousel-item a, .cmp-carousel__item a");
      newsLinks.forEach((link) => {
        const p = document.createElement("p");
        p.appendChild(link.cloneNode(true));
        col1Content.push(p);
      });
      if (newsLinks.length === 0) {
        const allLinks = pressReleasesCol.querySelectorAll("a");
        allLinks.forEach((link) => {
          const p = document.createElement("p");
          p.appendChild(link.cloneNode(true));
          col1Content.push(p);
        });
      }
    }
    if (featuredCol) {
      const cardImage = featuredCol.querySelector(".card-image, img");
      if (cardImage) col2Content.push(cardImage);
      const eyebrow = featuredCol.querySelector(".card-eyebrow, .card-metadata-tag");
      if (eyebrow) {
        const p = document.createElement("p");
        p.textContent = eyebrow.textContent.trim();
        col2Content.push(p);
      }
      const title = featuredCol.querySelector(".card-title, h4, h3");
      if (title) col2Content.push(title);
      const desc = featuredCol.querySelector(".card-description, p");
      if (desc) col2Content.push(desc);
      const cta = featuredCol.querySelector(".card-cta, a");
      if (cta) {
        const link = document.createElement("a");
        link.href = cta.closest("a") ? cta.closest("a").href : cta.href || "#";
        link.textContent = cta.textContent.trim() || "Read story";
        col2Content.push(link);
      }
    }
    const cells = [];
    cells.push([col1Content, col2Content]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed-video.js
  function parse3(element, { document }) {
    const cells = [];
    const contentCell = [];
    const posterImg = element.querySelector(".vjs-poster img, .video-js img, img.vjs-poster");
    if (posterImg) contentCell.push(posterImg);
    const videoEl = element.querySelector("video-js, video, [data-video-id]");
    const videoId = videoEl ? videoEl.getAttribute("data-video-id") || videoEl.getAttribute("id") : null;
    const accountId = videoEl ? videoEl.getAttribute("data-account") : null;
    if (videoId && accountId) {
      const videoUrl = `https://players.brightcove.net/${accountId}/default_default/index.html?videoId=${videoId}`;
      const link = document.createElement("a");
      link.href = videoUrl;
      link.textContent = videoUrl;
      contentCell.push(link);
    } else {
      const iframe = element.querySelector("iframe");
      if (iframe && iframe.src) {
        const link = document.createElement("a");
        link.href = iframe.src;
        link.textContent = iframe.src;
        contentCell.push(link);
      }
    }
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "embed-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-stats.js
  function parse4(element, { document }) {
    const cells = [];
    const storyCard = element.querySelector(".cardpagestory.card-dashboard");
    if (storyCard) {
      const img = storyCard.querySelector(".card-image, img");
      const eyebrow = storyCard.querySelector(".card-eyebrow");
      const title = storyCard.querySelector(".card-title, h4, h3");
      const cta = storyCard.querySelector(".card-cta, a");
      const textContent = [];
      if (eyebrow) {
        const p = document.createElement("p");
        p.innerHTML = `<em>${eyebrow.textContent.trim()}</em>`;
        textContent.push(p);
      }
      if (title) textContent.push(title);
      if (cta) {
        const link = storyCard.querySelector("a[href]");
        if (link) {
          const a = document.createElement("a");
          a.href = link.href;
          a.textContent = cta.textContent.trim();
          textContent.push(a);
        }
      }
      cells.push([img || "", textContent]);
    }
    const statCards = element.querySelectorAll(".dashboardcards");
    statCards.forEach((card) => {
      const factsContainer = card.querySelector(".dashboard-card-facts");
      if (!factsContainer) return;
      const eyebrow = factsContainer.querySelector(".eyebrow");
      const dataPoint = factsContainer.querySelector(".data-point");
      const dataSuffix = factsContainer.querySelector(".data-point-suffix");
      const description = factsContainer.querySelector(".description");
      const textContent = [];
      if (eyebrow) {
        const p = document.createElement("p");
        p.innerHTML = `<em>${eyebrow.textContent.trim()}</em>`;
        textContent.push(p);
      }
      if (dataPoint) {
        const h = document.createElement("h2");
        h.textContent = dataPoint.textContent.trim() + (dataSuffix ? dataSuffix.textContent.trim() : "");
        textContent.push(h);
      }
      if (description) {
        const p = document.createElement("p");
        p.textContent = description.textContent.trim();
        textContent.push(p);
      }
      cells.push(["", textContent]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-stats", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-media.js
  function parse5(element, { document }) {
    const col1Content = [];
    const col2Content = [];
    const image = element.querySelector(".cmp-image__image, .cmp-image img, img");
    if (image) col1Content.push(image);
    const eyebrow = element.querySelector(".cmp-header__text");
    if (eyebrow) {
      const p = document.createElement("p");
      p.innerHTML = `<em>${eyebrow.textContent.trim()}</em>`;
      col2Content.push(p);
    }
    const title = element.querySelector(".cmp-title__text, h5, h4, h3");
    if (title) col2Content.push(title);
    const desc = element.querySelector(".cmp-text p, .cmp-text");
    if (desc) col2Content.push(desc);
    const cta = element.querySelector("a.cmp-button, .button a");
    if (cta) col2Content.push(cta);
    const cells = [];
    cells.push([col1Content, col2Content]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-media", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse6(element, { document }) {
    const gridCells = element.querySelectorAll(".grid-row__col-with-4.grid-cell");
    const columnContents = [];
    gridCells.forEach((cell) => {
      const colContent = [];
      const img = cell.querySelector(".cmp-image__image, .cmp-image img, img");
      if (img) colContent.push(img);
      const desc = cell.querySelector(".cmp-text p, .cmp-text");
      if (desc) colContent.push(desc);
      const cta = cell.querySelector("a.cmp-button, .button a");
      if (cta) colContent.push(cta);
      if (colContent.length > 0) columnContents.push(colContent);
    });
    const cells = [];
    if (columnContents.length > 0) {
      cells.push(columnContents);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-cta.js
  function parse7(element, { document }) {
    const heading = element.querySelector(".cmp-title__text, h4, h3, h2");
    const description = element.querySelector(".cmp-text p, .cmp-text");
    const ctaLink = element.querySelector("a.cmp-button, .button a");
    const cells = [];
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (ctaLink) contentCell.push(ctaLink);
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-investor.js
  function parse8(element, { document }) {
    const cells = [];
    const earningsCard = element.querySelector(".cardpagestory.card-dashboard");
    if (earningsCard) {
      const eyebrow = earningsCard.querySelector(".card-eyebrow");
      const title = earningsCard.querySelector(".card-title, h4");
      const cta = earningsCard.querySelector(".card-cta");
      const link = earningsCard.querySelector("a[href]");
      const textContent = [];
      if (eyebrow) {
        const p = document.createElement("p");
        p.innerHTML = `<em>${eyebrow.textContent.trim()}</em>`;
        textContent.push(p);
      }
      if (title) textContent.push(title);
      if (cta && link) {
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = cta.textContent.trim();
        textContent.push(a);
      }
      cells.push(["", textContent]);
    }
    const linkCard = element.querySelector(".dashboardcards .dashboard-card_link__list");
    if (linkCard) {
      const eyebrow = linkCard.querySelector(".linkcard-eyebrow");
      const title = linkCard.querySelector(".linkcard-title, h5");
      const links = linkCard.querySelectorAll(".linkcard-link");
      const textContent = [];
      if (eyebrow) {
        const p = document.createElement("p");
        p.innerHTML = `<em>${eyebrow.textContent.trim()}</em>`;
        textContent.push(p);
      }
      if (title) textContent.push(title);
      links.forEach((lnk) => {
        const linkText = lnk.querySelector(".link-text");
        const a = document.createElement("a");
        a.href = lnk.href;
        a.textContent = linkText ? linkText.textContent.trim() : lnk.textContent.trim();
        const p = document.createElement("p");
        p.appendChild(a);
        textContent.push(p);
      });
      cells.push(["", textContent]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-investor", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-esg.js
  function parse9(element, { document }) {
    const cells = [];
    const statCard = element.querySelector(".dashboardcards.hide-image .dashboard-card-facts");
    if (statCard) {
      const eyebrow = statCard.querySelector(".eyebrow");
      const dataPoint = statCard.querySelector(".data-point");
      const dataSuffix = statCard.querySelector(".data-point-suffix");
      const description = statCard.querySelector(".description");
      const textContent = [];
      if (eyebrow) {
        const p = document.createElement("p");
        p.innerHTML = `<em>${eyebrow.textContent.trim()}</em>`;
        textContent.push(p);
      }
      if (dataPoint) {
        const h = document.createElement("h2");
        h.textContent = dataPoint.textContent.trim() + (dataSuffix ? dataSuffix.textContent.trim() : "");
        textContent.push(h);
      }
      if (description) {
        const p = document.createElement("p");
        p.textContent = description.textContent.trim();
        textContent.push(p);
      }
      cells.push(["", textContent]);
    }
    const esgCard = element.querySelector(".cardpagestory");
    if (esgCard) {
      const img = esgCard.querySelector(".card-image, img");
      const eyebrow = esgCard.querySelector(".card-eyebrow");
      const title = esgCard.querySelector(".card-title, h4");
      const desc = esgCard.querySelector(".card-description");
      const cta = esgCard.querySelector(".card-cta");
      const link = esgCard.querySelector("a[href]");
      const textContent = [];
      if (eyebrow) {
        const p = document.createElement("p");
        p.innerHTML = `<em>${eyebrow.textContent.trim()}</em>`;
        textContent.push(p);
      }
      if (title) textContent.push(title);
      if (desc) textContent.push(desc);
      if (cta && link) {
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = cta.textContent.trim();
        textContent.push(a);
      }
      cells.push([img || "", textContent]);
    }
    const linkCard = element.querySelector(".dashboardcards.light-theme-no-stroke .dashboard-card_link__list");
    if (linkCard) {
      const eyebrow = linkCard.querySelector(".linkcard-eyebrow");
      const title = linkCard.querySelector(".linkcard-title, h5");
      const links = linkCard.querySelectorAll(".linkcard-link");
      const textContent = [];
      if (eyebrow) {
        const p = document.createElement("p");
        p.innerHTML = `<em>${eyebrow.textContent.trim()}</em>`;
        textContent.push(p);
      }
      if (title) textContent.push(title);
      links.forEach((lnk) => {
        const linkText = lnk.querySelector(".link-text");
        const a = document.createElement("a");
        a.href = lnk.href;
        a.textContent = linkText ? linkText.textContent.trim() : lnk.textContent.trim();
        const p = document.createElement("p");
        p.appendChild(a);
        textContent.push(p);
      });
      cells.push(["", textContent]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-esg", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/abbvie-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        ".onetrust-pc-dark-filter"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".cmp-experiencefragment--header",
        ".cmp-experiencefragment--footer",
        "iframe",
        "link",
        "noscript",
        ".popup-overlay",
        ".popup-alert",
        "#popup-alert",
        ".cmp-popup",
        "[data-popup-type]"
      ]);
      element.querySelectorAll("img").forEach((img) => {
        const src = img.getAttribute("src") || "";
        if (src.includes("t.co/") || src.includes("analytics.twitter.com") || src.includes("adsct") || src.includes("c.bing.com") || src.includes("pixel") || src.startsWith("blob:")) {
          img.remove();
        }
      });
      const popupPatterns = [
        /^CLOSE$/i,
        /about to leave the AbbVie/i,
        /No,?\s*I disagree/i,
        /Yes,?\s*I agree/i,
        /product-specific site/i
      ];
      element.querySelectorAll("h1, h2, h3, h4, h5, h6, p, span, div").forEach((el) => {
        const text = el.textContent.trim();
        if (text && popupPatterns.some((pattern) => pattern.test(text)) && !el.querySelector('.cards-esg, .cards-investor, [class*="cards"], [class*="columns"], [class*="hero"]')) {
          el.remove();
        }
      });
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("onclick");
        el.removeAttribute("data-analytics");
      });
    }
  }

  // tools/importer/transformers/abbvie-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const template = payload && payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = template.sections;
      const document = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        let sectionEl = null;
        const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];
        for (const sel of selectorList) {
          try {
            sectionEl = element.querySelector(sel);
          } catch (e) {
          }
          if (sectionEl) break;
        }
        if (!sectionEl && section.blocks && section.blocks.length > 0) {
          for (const blockName of section.blocks) {
            try {
              sectionEl = element.querySelector(`.${blockName}`);
            } catch (e) {
            }
            if (sectionEl) break;
          }
        }
        if (!sectionEl && section.defaultContent && section.defaultContent.length > 0) {
          for (const sel of section.defaultContent) {
            try {
              sectionEl = element.querySelector(sel);
            } catch (e) {
            }
            if (sectionEl) break;
          }
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-video": parse,
    "columns-news": parse2,
    "embed-video": parse3,
    "cards-stats": parse4,
    "columns-media": parse5,
    "columns-feature": parse6,
    "hero-cta": parse7,
    "cards-investor": parse8,
    "cards-esg": parse9
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "AbbVie corporate homepage with hero, featured content, and company information",
    urls: [
      "https://www.abbvie.com/"
    ],
    blocks: [
      {
        name: "hero-video",
        instances: [".cmp-home-hero"]
      },
      {
        name: "columns-news",
        instances: [".grid.cmp-grid-custom.no-bottom-margin:has(.carousel.cmp-carousel--rss)"]
      },
      {
        name: "embed-video",
        instances: [".video.cmp-video-xx-large"]
      },
      {
        name: "cards-stats",
        instances: [".grid:has(.cardpagestory.card-dashboard):has(.dashboardcards.medium-theme)"]
      },
      {
        name: "columns-media",
        instances: [".container.abbvie-container:has(#title-d74551ecff)"]
      },
      {
        name: "columns-feature",
        instances: [".grid.cmp-grid-custom.no-bottom-margin:has(#button-2e6b619938)"]
      },
      {
        name: "hero-cta",
        instances: ["#container-fccf146707"]
      },
      {
        name: "cards-investor",
        instances: [".grid:has(.cardpagestory.card-dashboard.medium-theme):has(.dashboard-card_link__list)"]
      },
      {
        name: "cards-esg",
        instances: ["#container-3a42f76c63"]
      }
    ],
    sections: [
      {
        id: "section-hero",
        name: "Hero",
        selector: ".homepage-hero-controller",
        style: null,
        blocks: ["hero-video"],
        defaultContent: []
      },
      {
        id: "section-news",
        name: "News and Featured",
        selector: ".homepage-overlap",
        style: null,
        blocks: ["columns-news"],
        defaultContent: []
      },
      {
        id: "section-patients",
        name: "Patients",
        selector: ".teaser:has(.cmp-teaser__pretitle:empty) + .video",
        style: null,
        blocks: [],
        defaultContent: [".cmp-teaser:has(.cmp-teaser__title):not([id])"]
      },
      {
        id: "section-video",
        name: "Video",
        selector: ".video.cmp-video-xx-large",
        style: null,
        blocks: ["embed-video"],
        defaultContent: []
      },
      {
        id: "section-science",
        name: "Science and Innovation",
        selector: "#teaser-a2987e48b8",
        style: null,
        blocks: ["cards-stats"],
        defaultContent: ["#teaser-a2987e48b8"]
      },
      {
        id: "section-podcast",
        name: "Podcast",
        selector: ".container.abbvie-container:has(#title-d74551ecff)",
        style: null,
        blocks: ["columns-media"],
        defaultContent: []
      },
      {
        id: "section-culture",
        name: "Culture of Curiosity",
        selector: "#section02",
        style: null,
        blocks: ["columns-feature"],
        defaultContent: ["#section02"]
      },
      {
        id: "section-cta",
        name: "Explore Opportunities",
        selector: ".container.abbvie-container.medium-radius:has(#container-fccf146707)",
        style: "dark",
        blocks: ["hero-cta"],
        defaultContent: []
      },
      {
        id: "section-investors",
        name: "Investor Resources",
        selector: "#section03",
        style: null,
        blocks: ["cards-investor"],
        defaultContent: ["#section03"]
      },
      {
        id: "section-esg",
        name: "ESG",
        selector: "#section04",
        style: null,
        blocks: ["cards-esg"],
        defaultContent: ["#section04"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
              section: blockDef.section || null
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
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
