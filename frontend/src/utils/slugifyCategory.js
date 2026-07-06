export function slugifyCategory(category) {
  return category.toLowerCase().replace(/\s+/g, "-");
}
