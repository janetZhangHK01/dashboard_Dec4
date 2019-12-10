// import trackerClient from '@hk01-digital/data-tracker-client';
import parse from 'url-parse';
import getAccountId from './account';
import { cookieName } from '../cookie.js';

const DIMENSION_ARTICLE_AUTHOR = 1; //dimension1
const DIMENSION_SECTION_NAME = 2; // dimension2
const DIMENSION_CHANNEL_NAME = 3; // dimension3
const DIMENSION_ARTICLE_ID = 5; // dimension5
const DIMENSION_ROLE = 6; // dimension6: Member/Anonymous
const DIMENSION_MEMBER_ID = 7; // dimension7/9
const DIMENSION_ANONYMOUS_ID = 8; // dimension8

const bucketID = '00001';

/** ***** helper function ******* */
const buildEventData = (params) => {
  const defaultParams = {
    anonymous_id: window[cookieName.ANONYMOUS_ID],
    session_id: window[cookieName.SESSION_ID],
    ts: Date.now(),
  };
  return JSON.stringify(Object.assign({}, defaultParams, params));
};

function isElementInViewport(el) {
  if (typeof jQuery === 'function' && el instanceof jQuery) {
    // eslint-disable-next-line prefer-destructuring,no-param-reassign
    el = el[0];
  }
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight ||
      document.documentElement.clientHeight) && /* or $(window).height() */
    rect.right <= (window.innerWidth ||
      document.documentElement.clientWidth) /* or $(window).width() */
  );
}

const buildReachData = ($card, params = {}) => {
  const cardType = $card.attr('data-card-type');
  const cardId = $card.attr('data-id');
  const obj = params;
  switch (cardType) {
    case 'articleCard':
      obj.article_id = cardId;
      obj.category = $card.attr('data-category');
      obj.highlight = $card.attr('data-highlight') === 1;
      obj.focus = $card.attr('data-focus') === 1;
      obj.item_position = parseInt($card.attr('data-position'), 10);
      break;
    case 'videoCard':
      obj.article_id = cardId;
      obj.category = $card.attr('data-category');
      obj.highlight = $card.attr('data-highlight') === 1;
      obj.focus = $card.attr('data-focus') === 1;
      obj.video_id = $card.attr('data-video-id');
      obj.item_position = parseInt($card.attr('data-position'), 10);
      break;
    case 'gameCard':
      obj.target_url = $card.attr('data-target-url');
      obj.game_name = $card.attr('data-game-name');
      obj.game_id = cardId;
      obj.item_position = parseInt($card.attr('data-position'), 10);
      break;
    case 'eventCard':
      obj.article_id = cardId;
      obj.category = $card.attr('data-category');
      obj.target_url = $card.find('a').attr('href');
      obj.item_position = parseInt($card.attr('data-position'), 10);
      break;
    case 'articleBlock':
      obj.block_id = parseInt($card.attr('data-block-position'), 10);
      break;
    case 'relatedLink':
      obj.article_id = cardId;
      obj.category = $card.attr('data-category');
      obj.target_url = $card.attr('data-target-url');
      break;
    default:
      break;
  }
  return obj;
};

const getPageViewData = () => {
  // if the page has that element, that is an article detail page
  const $articleDom = $('.article-detail-content');

  const articleId = $articleDom.attr('data-article-id');
  const articleCategory = $articleDom.attr('data-category');
  const articleAuthor = $articleDom.attr('data-author');

  const data = {};

  data[[DIMENSION_ARTICLE_AUTHOR]] = typeof articleAuthor === 'undefined' ?
    null :
    articleAuthor;
  data[[DIMENSION_ARTICLE_ID]] = typeof articleId === 'undefined' ?
    null :
    articleId;
  data[[DIMENSION_CHANNEL_NAME]] = typeof articleCategory === 'undefined' ?
    null :
    articleCategory;
  data[[DIMENSION_ANONYMOUS_ID]] = window[cookieName.ANONYMOUS_ID];
  const accountId = getAccountId();
  data[[DIMENSION_ROLE]] = accountId ? 'Member' : 'Anonymous';
  data[[DIMENSION_MEMBER_ID]] = accountId;

  return data;
};

/** ***** init tracker!! ******* */
const initTracker = () => {
  if (typeof window.dataTracker === 'undefined') {
    // eslint-disable-next-line global-require
    // const trackerClient = require('@hk01-digital/data-tracker-client');
    // eslint-disable-next-line no-undef
    JSON_PIWIK = JSON;
    window.dataTracker = new trackerClient({
      GA: {
        trackingId: window.gaTrackingId,
      },
      Piwik: {
        trackingUrl: window.piwikTrackingUrl,
        siteId: window.piwikSiteId,
        // NB: keep the typo for backward-compatibility
        userId: window.hk01_annonymous_id,
        isSPA: true,
      },
    }, false);
  }
  return window.dataTracker;
};

/** ***** tracking function  ******* */
const trackEvent = (ga = true, piwik = true, category = '', action = '', params = {}) => {
  if (typeof window === 'undefined') {
    // eslint-disable-next-line no-console
    console.error('window is not ready, abort tracking');
    return;
  }
  initTracker();
  window.dataTracker.fire(
    { GA: ga, Piwik: piwik },
    {
      category,
      action,
      label: buildEventData(params),
    },
  );
};

const trackPageView = (tail = '') => {
  initTracker();
  window.dataTracker.pageView(
    {
      GA: true,
      Piwik: true,
    },
    getPageViewData(),
    window.location.href + tail,
    parse(window.location.href).pathname + tail,
  );
};

/**
 *   check if the dom in viewport
 *   if it is in viewport and not yet tracked before
 *   track it, and save it in window.inViewportAlready
 */
const trackReach = (
  el, category, action = 'reach', section = 'default', params = {},
  trackGa = false,
) => {
  $(window).on('DOMContentLoaded load resize scroll', () => {
    window.inViewportAlready = window.inViewportAlready || {};
    window.inViewportAlready[category] = window.inViewportAlready[category] ||
      {};
    window.inViewportAlready[category][section] = window.inViewportAlready[category][section] ||
      {};

    $(el).each(function () {
      const cardId = $(this).attr('data-id');
      const notTracked = typeof window.inViewportAlready[category][section][cardId] ===
        'undefined';

      if (isElementInViewport($(this)) && notTracked) {
        const copy = $.extend({}, params);
        window.inViewportAlready[category][section][cardId] = $(this);
        const obj = buildReachData($(this), copy);
        trackEvent(trackGa, true, category, action, obj);
      }
    });
  });
};

const trackEventOnce = ($el, ga = true, piwik = true, category = '', action = '', params = {}) => {
  window.inViewportAlready = window.inViewportAlready || {};
  window.inViewportAlready[category] = window.inViewportAlready[category] ||
    {};
  window.inViewportAlready[category][action] = window.inViewportAlready[category][action] ||
    {};

  const id = $el.attr('data-id');
  const notTracked = typeof window.inViewportAlready[category][action][id] ===
    'undefined';
  if (notTracked) {
    window.inViewportAlready[category][action][id] = $el;
    trackEvent(ga, piwik, category, action, params);
  }
};

export {
  buildReachData, trackEvent, trackEventOnce, trackReach, trackPageView, initTracker,
};
