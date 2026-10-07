export const truncate = (str = '', n = 80) =>
  str.length > n ? `${str.slice(0, n - 1)}…` : str;

export const initials = (name = '') =>
  name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

export const kBytes = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
