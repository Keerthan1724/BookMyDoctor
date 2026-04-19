export const getInitialFromName = (name = "") => {
  const trimmedName = String(name).trim();
  if (!trimmedName) return "?";

  const normalizedName = trimmedName.replace(/^dr\.?\s+/i, "").trim();
  const firstCharacter = normalizedName.charAt(0) || trimmedName.charAt(0);

  return firstCharacter.toUpperCase();
};
