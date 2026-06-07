const noop = (...args) => args[0] ?? {};
const useRouter = () => ({ push(){}, replace(){}, currentRoute: { value: {} } });
const createRouter = (options = {}) => ({ ...options, beforeEach(){}, afterEach(){}, push(){}, replace(){}, install(){} });
const createWebHistory = (base = '/') => ({ base });
export { createWebHistory as a, createRouter as s, useRouter as u };
