const renderer = (island) => async () => {
  try { island.removeAttribute('ssr'); } catch (_) {}
};
export { renderer as default };
