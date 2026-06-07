const resolved = new Set();
const passthrough = (value) => value;
const preload = async (loader, deps) => {
  try { (deps || []).forEach((dep) => resolved.add(dep)); } catch (_) {}
  return typeof loader === 'function' ? loader() : loader;
};
const noop = (...args) => args[0] ?? undefined;
export { preload as _, passthrough as a, noop as b, noop as c, noop as d, noop as e, noop as r, noop as T, noop as u, noop as v, noop as w };
