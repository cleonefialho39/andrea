const noop = (...args) => args[0] ?? false;
const isPreviewDomain = (origin, domains = []) => {
  try { return domains.some((domain) => String(origin || '').includes(domain)); } catch (_) { return false; }
};
const isBuilder = () => false;
const gtagSafe = (...args) => {
  try {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
    window.gtag(...args);
  } catch (_) {}
};
const a = isBuilder;
const b = gtagSafe;
const c = noop;
const d = noop;
const e = noop;
const f = noop;
const g = isPreviewDomain;
const h = noop;
const i = noop;
const j = noop;
const k = noop;
const l = noop;
const m = noop;
const n = noop;
const o = noop;
const s = noop;
const u = noop;
export { a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,s,u };
