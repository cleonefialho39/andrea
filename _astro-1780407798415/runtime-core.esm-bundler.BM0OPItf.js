const makeStub = () => {
  const fn = function(...args) { return args.length ? args[0] : stub; };
  const stub = new Proxy(fn, {
    get(target, prop) {
      if (prop === Symbol.iterator) return function*(){};
      if (prop === Symbol.toPrimitive) return () => '';
      if (prop === 'then') return undefined;
      if (prop === 'valueOf') return () => 0;
      if (prop === 'toString') return () => '';
      if (prop === '__v_isRef') return false;
      if (prop === 'value') return undefined;
      return stub;
    },
    apply(target, thisArg, args) { return args.length ? args[0] : stub; },
    construct() { return stub; }
  });
  return stub;
};
const stub = makeStub();
const defineComponent = (options) => options || {};
const vnodeCompat = (...args) => ({ __andreaVNode: true, args });
const ref = (value) => ({ value });
const computed = (getter) => ({ get value(){ try { return typeof getter === 'function' ? getter() : getter; } catch (_) { return undefined; } } });

const A = stub;
const B = stub;
const C = stub;
const D = stub;
const E = stub;
const F = stub;
const G = stub;
const H = stub;
const I = stub;
const J = stub;
const K = stub;
const L = stub;
const M = stub;
const N = stub;
const O = stub;
const P = stub;
const Q = stub;
const R = stub;
const S = stub;
const T = stub;
const U = stub;
const V = stub;
const W = stub;
const X = stub;
const Y = stub;
const Z = stub;
const _ = stub;
const a = stub;
const b = computed;
const c = stub;
const d = defineComponent;
const e = stub;
const f = stub;
const g = stub;
const h = vnodeCompat;
const i = stub;
const j = stub;
const k = stub;
const l = stub;
const m = stub;
const n = stub;
const o = stub;
const p = stub;
const q = stub;
const r = ref;
const s = stub;
const t = stub;
const u = stub;
const v = stub;
const w = stub;
const x = stub;
const y = stub;
const z = stub;
export { A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, _, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z };
