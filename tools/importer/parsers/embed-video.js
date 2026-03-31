/* eslint-disable */
/* global WebImporter */

/**
 * Parser for embed-video variant.
 * Base block: embed
 * Source: https://www.abbvie.com/
 * Selector: .video.cmp-video-xx-large
 *
 * Brightcove video with poster image. Embed block: 1 row with poster image + video URL.
 */
export default function parse(element, { document }) {
  const cells = [];
  const contentCell = [];

  // Poster image - found in .vjs-poster img or video poster attribute
  const posterImg = element.querySelector('.vjs-poster img, .video-js img, img.vjs-poster');
  if (posterImg) contentCell.push(posterImg);

  // Video URL - try to find Brightcove embed URL or data attributes
  const videoEl = element.querySelector('video-js, video, [data-video-id]');
  const videoId = videoEl ? (videoEl.getAttribute('data-video-id') || videoEl.getAttribute('id')) : null;
  const accountId = videoEl ? videoEl.getAttribute('data-account') : null;

  if (videoId && accountId) {
    const videoUrl = `https://players.brightcove.net/${accountId}/default_default/index.html?videoId=${videoId}`;
    const link = document.createElement('a');
    link.href = videoUrl;
    link.textContent = videoUrl;
    contentCell.push(link);
  } else {
    // Fallback: look for any iframe or link with video URL
    const iframe = element.querySelector('iframe');
    if (iframe && iframe.src) {
      const link = document.createElement('a');
      link.href = iframe.src;
      link.textContent = iframe.src;
      contentCell.push(link);
    }
  }

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-video', cells });
  element.replaceWith(block);
}
