/**
 * Normalizes text for keyword matching.
 * "La Paz!" → ["la", "paz"]
 *
 * Steps: NFD normalize → remove diacritics → lowercase → remove punctuation → split by spaces
 */
export function normalizeAndSplit(text: string): string[] {
  if (!text) return [];
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics: ñ → n, á → a
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove punctuation
    .split(/\s+/)
    .filter(Boolean);
}
