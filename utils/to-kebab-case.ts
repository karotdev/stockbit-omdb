export const toKebabCase = (value: string): string => {
  return value
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/([A-Z])/g, " $1")
    .replace(/[\s_]+/g, "-")
    .toLowerCase()
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
};
