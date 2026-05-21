/**
 * FAST Athletics — Content Loader
 * Fetches data.json and populates the page dynamically.
 *
 * HOW TO USE IN YOUR index.html:
 *   1. Add this tag near the top of <body>:
 *        <script src="/content-loader.js"></script>
 *
 *   2. Add data-fa="key" attributes to any HTML element you want
 *      auto-populated. Examples:
 *
 *        <span data-fa="settings.next_meet_name"></span>
 *        <span data-fa="settings.next_meet_date"></span>
 *        <span data-fa="settings.next_meet_location"></span>
 *        <span data-fa="settings.join_notice"></span>
 *        <span data-fa="settings.order_status"></span>
 *
 *   3. For lists (coaches, schedule, events, media) the loader fires a
 *      custom window event after data loads so your existing JS can read it:
 *
 *        window.addEventListener('fa-data-loaded', (e) => {
 *          const { coaches, schedule, events, media, settings } = e.detail;
 *          // rebuild your sections here
 *        });
 *
 *   4. The full data object is also available globally as window.FAdata
 *      so any existing script can access it after the event fires.
 */

(function () {
  'use strict';

  function populate(data) {
    // Fill simple text nodes tagged with data-fa="settings.xxx"
    document.querySelectorAll('[data-fa]').forEach(function (el) {
      const key = el.getAttribute('data-fa');
      const parts = key.split('.');
      let value = data;
      for (const p of parts) {
        if (value == null) break;
        value = value[p];
      }
      if (value != null && typeof value !== 'object') {
        el.textContent = value;
      }
    });

    // Expose globally and fire event for list rendering
    window.FAdata = data;
    window.dispatchEvent(new CustomEvent('fa-data-loaded', { detail: data }));
  }

  function load() {
    fetch('/data.json?_=' + Date.now())
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (data) populate(data);
      })
      .catch(function () {
        // Silently fail — site renders with its default hardcoded content
        console.warn('[FAST Athletics] content-loader: could not fetch data.json');
      });
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
