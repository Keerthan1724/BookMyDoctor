export const customModal = (config) => {
  window.dispatchEvent(
    new CustomEvent("open-modal", {
      detail: config,
    })
  );
};