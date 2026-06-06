export const getImageUrl = (path, options = {}) => {
  if (!path) return null;

  const { bustCache = false } = options;

  // If it's already a full URL, check if it's the backend URL and replace with current origin
  if (path.startsWith("http")) {
    const backendUrl = "http://127.0.0.1:8000";
    if (path.startsWith(backendUrl)) {
      // Replace backend URL with current origin for development
      const currentOrigin = window.location.origin;
      path = path.replace(backendUrl, currentOrigin);
    }
    // If it's already a proper URL, use it as is
  }

  if (!bustCache) {
    return path;
  }

  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}t=${Date.now()}`;
};
