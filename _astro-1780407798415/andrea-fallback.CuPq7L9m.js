(function () {
  'use strict';

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  const WHATSAPP_NUMBER = '5521998796297';
  const ACTIVE_ATTR = 'data-animation-state';
  const OPEN_DROPDOWN_CLASS = 'block-header-layout-mobile__dropdown--open';
  const OPEN_BURGER_CLASS = 'burger--open';
  const YOUTUBE_IDS_BY_CONTAINER_ID = {
    zHucRu: 'g1FmKITU5jA',
    z51YTo: 'TyX42DPYqqo',
    zd0ghF: 'XnsH_cGbs0s'
  };

  function markImageWrapperLoaded(element) {
    if (!element || element.getAttribute('data-animation-role') !== 'image') return;
    const image = element.querySelector('img');
    const done = function () { element.classList.add('loaded'); };
    if (!image || image.complete) {
      done();
      return;
    }
    image.addEventListener('load', done, { once: true });
    image.addEventListener('error', done, { once: true });
  }

  function resetAnimationState(root) {
    root.removeAttribute(ACTIVE_ATTR);
    root.classList.remove('andrea-animated');
    root.querySelectorAll && root.querySelectorAll('[data-animation-role="block-element"], [data-animation-role="image"]').forEach(function (child) {
      child.removeAttribute(ACTIVE_ATTR);
      if (child.getAttribute('data-animation-role') === 'image') markImageWrapperLoaded(child);
    });
  }

  function activateRoot(root, index) {
    if (!root || root.dataset.andreaAnimationDone === '1') return;
    root.dataset.andreaAnimationDone = '1';
    const baseDelay = Math.min(index || 0, 8) * 28;
    window.setTimeout(function () {
      root.setAttribute(ACTIVE_ATTR, 'active');
      root.classList.add('andrea-animated');
      const roleElements = Array.from(root.querySelectorAll('[data-animation-role="block-element"], [data-animation-role="image"]'));
      roleElements.forEach(function (element, childIndex) {
        if (element.getAttribute('data-animation-role') === 'image') markImageWrapperLoaded(element);
        window.setTimeout(function () {
          element.setAttribute(ACTIVE_ATTR, 'active');
        }, childIndex * 24);
      });
    }, baseDelay);
  }

  function activateVisibleAndNearViewport() {
    const roots = Array.from(document.querySelectorAll('.transition'));
    roots.forEach(function (root, index) {
      const rect = root.getBoundingClientRect();
      if (rect.top < window.innerHeight * 1.55 && rect.bottom > -window.innerHeight * 0.3) {
        activateRoot(root, index);
      }
    });
  }

  function activateAllAnimations() {
    document.querySelectorAll('.transition').forEach(function (root, index) { activateRoot(root, index); });
  }

  function setupAnimations() {
    const roots = Array.from(document.querySelectorAll('.transition'));
    if (!roots.length) return;

    roots.forEach(resetAnimationState);

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      activateAllAnimations();
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        activateRoot(entry.target, roots.indexOf(entry.target));
        observer.unobserve(entry.target);
      });
    }, { root: null, rootMargin: '0px 0px 28% 0px', threshold: 0.01 });

    roots.forEach(function (root) { observer.observe(root); });
    window.requestAnimationFrame(activateVisibleAndNearViewport);
    window.setTimeout(activateVisibleAndNearViewport, 250);
  }

  function showVisibleSlides(container) {
    const slides = Array.from(container.querySelectorAll('.slide'));
    if (!slides.length) return;
    let active = slides.findIndex(function (slide) {
      return slide.classList.contains('slide--current') || slide.getAttribute('aria-hidden') === 'false';
    });
    if (active < 0) active = 0;
    function render(nextIndex) {
      active = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, index) {
        const isActive = index === active;
        slide.classList.toggle('slide--current', isActive);
        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        slide.style.display = isActive ? '' : 'none';
      });
    }
    render(active);
    container.querySelectorAll('.slideshow-nav-button--left').forEach(function (button) {
      button.addEventListener('click', function () { render(active - 1); });
    });
    container.querySelectorAll('.slideshow-nav-button--right').forEach(function (button) {
      button.addEventListener('click', function () { render(active + 1); });
    });
  }

  function bindMobileMenu() {
    document.addEventListener('click', function (event) {
      const button = event.target.closest('.burger, .block-header__hamburger-menu');
      if (!button) return;
      const header = button.closest('.block-header-layout-mobile') || document;
      const dropdown = header.querySelector('.block-header-layout-mobile__dropdown');
      const shouldOpen = !button.classList.contains(OPEN_BURGER_CLASS);
      button.classList.toggle(OPEN_BURGER_CLASS, shouldOpen);
      button.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
      if (dropdown) {
        dropdown.classList.toggle(OPEN_DROPDOWN_CLASS, shouldOpen);
        dropdown.hidden = false;
        dropdown.style.display = '';
      }
    }, false);
  }

  function getYouTubeIdFromString(value) {
    if (!value) return null;
    const text = String(value);
    const patterns = [
      /(?:youtube(?:-nocookie)?\.com\/(?:embed|shorts)\/|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
      /[?&]v=([A-Za-z0-9_-]{6,})/,
      /\/vi\/([A-Za-z0-9_-]{6,})\//,
      /(?:^|[\/])yt_([A-Za-z0-9_-]{6,})\.(?:jpe?g|png|webp)(?:$|[?#])/
    ];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  }

  function getYouTubeIdFromElement(element) {
    const container = element.closest('.layout-element__component--GridVideo, .video, .layout-element') || element.parentElement;
    const videoContainer = element.closest('.layout-element__component--GridVideo, .video') || container;
    if (videoContainer && videoContainer.id && YOUTUBE_IDS_BY_CONTAINER_ID[videoContainer.id]) {
      return YOUTUBE_IDS_BY_CONTAINER_ID[videoContainer.id];
    }
    if (videoContainer) {
      const direct = videoContainer.getAttribute('data-youtube-id') || videoContainer.dataset.youtubeId;
      const directId = getYouTubeIdFromString(direct) || direct;
      if (directId && /^[A-Za-z0-9_-]{6,}$/.test(directId)) return directId;
    }
    const candidates = [];
    if (container) {
      container.querySelectorAll('img, source, iframe, [data-youtube-id], [data-src], [src], [srcset]').forEach(function (node) {
        ['data-youtube-id', 'data-original-src', 'data-src', 'data-video-src', 'src', 'srcset', 'href'].forEach(function (attr) {
          const value = node.getAttribute && node.getAttribute(attr);
          if (value) candidates.push(value);
        });
      });
    }
    for (const value of candidates) {
      const id = getYouTubeIdFromString(value);
      if (id) return id;
    }
    return null;
  }

  function bindHeroVideos() {
    document.querySelectorAll('video[autoplay]').forEach(function (video) {
      video.muted = true;
      video.autoplay = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.setAttribute('preload', 'auto');
      const tryPlay = function () {
        const result = video.play && video.play();
        if (result && typeof result.catch === 'function') result.catch(function () {});
      };
      if (video.readyState >= 2) tryPlay();
      video.addEventListener('canplay', tryPlay, { once: true });
      setTimeout(tryPlay, 250);
    });
  }

  function createYouTubeFrame(videoId) {
    const iframe = document.createElement('iframe');
    iframe.className = 'video__frame andrea-youtube-frame';
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen');
    iframe.setAttribute('loading', 'eager');
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    iframe.setAttribute('title', 'YouTube video player');
    iframe.src = 'https://www.youtube.com/embed/' + encodeURIComponent(videoId) + '?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = '0';
    iframe.style.background = '#000';
    return iframe;
  }

  function prepareYouTubePlaceholders() {
    document.querySelectorAll('.layout-element__component--GridVideo, .video').forEach(function (container) {
      const id = container.id && YOUTUBE_IDS_BY_CONTAINER_ID[container.id];
      if (id && !container.getAttribute('data-youtube-id')) container.setAttribute('data-youtube-id', id);
      const image = container.querySelector('img.video__placeholder, img');
      if (image) {
        image.setAttribute('loading', 'eager');
        if (!image.getAttribute('decoding')) image.setAttribute('decoding', 'async');
      }
      const button = container.querySelector('.video__play--youtube');
      if (button) {
        button.setAttribute('type', 'button');
        if (!button.getAttribute('aria-label')) button.setAttribute('aria-label', 'Reproduzir vídeo');
        if (!button.getAttribute('title')) button.setAttribute('title', 'Reproduzir vídeo');
      }
    });
  }

  function openYouTubePlayer(trigger) {
    const videoId = getYouTubeIdFromElement(trigger);
    if (!videoId) return false;
    const container = trigger.closest('.layout-element__component--GridVideo, .video') || trigger.closest('.layout-element') || trigger.parentElement;
    if (!container) return false;
    const current = container.querySelector('iframe.andrea-youtube-frame, iframe.video__frame');
    if (current) return true;
    container.classList.add('andrea-youtube-loaded');
    container.replaceChildren(createYouTubeFrame(videoId));
    return true;
  }

  function bindYouTubePlayers() {
    prepareYouTubePlaceholders();
    document.addEventListener('click', function (event) {
      const button = event.target.closest('.video__play--youtube');
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      openYouTubePlayer(button);
    }, true);
    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const button = event.target.closest && event.target.closest('.video__play--youtube');
      if (!button) return;
      event.preventDefault();
      openYouTubePlayer(button);
    }, true);
  }

  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === 'function') return window.CSS.escape(value);
    return String(value).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
  }

  function normalizeLabel(element) {
    const id = element.getAttribute('id');
    const label = id ? document.querySelector('label[for="' + cssEscape(id) + '"]') : null;
    const text = label ? label.textContent : (element.getAttribute('name') || element.getAttribute('placeholder') || 'Campo');
    return String(text).replace(/\*/g, '').trim();
  }

  function bindForms() {
    document.addEventListener('submit', function (event) {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      if (!form.classList.contains('form__control')) return;
      event.preventDefault();
      const fields = Array.from(form.querySelectorAll('input, textarea, select'))
        .map(function (element) { return [normalizeLabel(element), String(element.value || '').trim()]; })
        .filter(function (pair) { return pair[1]; });
      const message = fields.length
        ? fields.map(function (pair) { return pair[0] + ': ' + pair[1]; }).join('\n')
        : 'Olá, gostaria de mais informações.';
      window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message), '_blank', 'noopener');
    }, true);
  }

  function boot() {
    setupAnimations();
    document.querySelectorAll('.slideshow').forEach(showVisibleSlides);
    bindMobileMenu();
    bindHeroVideos();
    bindYouTubePlayers();
    bindForms();
    window.addEventListener('scroll', activateVisibleAndNearViewport, { passive: true });
    window.addEventListener('resize', activateVisibleAndNearViewport, { passive: true });
    setTimeout(function () { prepareYouTubePlaceholders(); bindHeroVideos(); activateVisibleAndNearViewport(); }, 350);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
