import { normalizeAndSplit } from '../../src/chatbot/helpers/text-normalizer';

describe('normalizeAndSplit', () => {
  it('should split basic text', () => {
    expect(normalizeAndSplit('La Paz')).toEqual(['la', 'paz']);
  });

  it('should remove punctuation', () => {
    expect(normalizeAndSplit('La Paz!')).toEqual(['la', 'paz']);
  });

  it('should handle accents', () => {
    expect(normalizeAndSplit('Cochabamba')).toEqual(['cochabamba']);
  });

  it('should lowercase', () => {
    expect(normalizeAndSplit('SANTA CRUZ')).toEqual(['santa', 'cruz']);
  });

  it('should handle empty string', () => {
    expect(normalizeAndSplit('')).toEqual([]);
  });

  it('should handle null-ish', () => {
    expect(normalizeAndSplit(null as any)).toEqual([]);
    expect(normalizeAndSplit(undefined as any)).toEqual([]);
  });

  it('should split multiple spaces', () => {
    expect(normalizeAndSplit('la   paz')).toEqual(['la', 'paz']);
  });

  it('should remove diacritics (accents)', () => {
    expect(normalizeAndSplit('José')).toEqual(['jose']);
    expect(normalizeAndSplit('Ñuble')).toEqual(['nuble']);
  });

  it('should handle mixed case and punctuation', () => {
    expect(normalizeAndSplit('¡Hola, Mundo!')).toEqual(['hola', 'mundo']);
  });
});
