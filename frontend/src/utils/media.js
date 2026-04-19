export const getImageUrl = (path, options = {}) => {
  if (!path) return null;

  const { bustCache = false } = options;
  const rawUrl = path.startsWith("http") ? path : `http://localhost:8000${path}`;

  if (!bustCache) {
    return rawUrl;
  }

  const separator = rawUrl.includes("?") ? "&" : "?";
  return `${rawUrl}${separator}t=${Date.now()}`;
};
