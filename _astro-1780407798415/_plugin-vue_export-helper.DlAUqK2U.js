const helper = (sfc, props) => {
  const target = sfc && (sfc.__vccOpts || sfc) || {};
  if (Array.isArray(props)) {
    for (const [key, value] of props) target[key] = value;
  }
  return target;
};
export { helper as _ };
