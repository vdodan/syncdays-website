// First-party page-view ping for FAB sites. No cookies, no storage, no fingerprinting.
// Sends host, path, referrer and viewport width to the collector; the collector adds country and
// device class and counts the visit. Copy to public/a.js in a site; load with <script defer src="/a.js">.
(function () {
  var l = location;
  if (l.hostname === 'localhost' || l.hostname === '127.0.0.1') return;
  if (navigator.doNotTrack === '1') return;
  var body = JSON.stringify({ h: l.hostname, p: l.pathname, r: document.referrer, w: window.innerWidth });
  var url = 'https://t.thefabsquad.com/c';
  // text/plain keeps this a "simple" request: no CORS preflight.
  if (!(navigator.sendBeacon && navigator.sendBeacon(url, new Blob([body], { type: 'text/plain' })))) {
    fetch(url, { method: 'POST', body: body, headers: { 'content-type': 'text/plain' }, keepalive: true }).catch(function () {});
  }
})();
