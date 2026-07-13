export function normalizeDate(date: string) {
  return new Date(date).toLocaleDateString();
}