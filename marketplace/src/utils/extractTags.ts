const CONDITION_TAGS = [
  { pattern: /\bnov[ao]\b/i, tag: 'Novo' },
  { pattern: /\bseminovos?\b/i, tag: 'Seminovo' },
  { pattern: /\boriginal\b/i, tag: 'Original' },
  { pattern: /\bedi[cç][aã]o\s+limitada\b/i, tag: 'Edição Limitada' },
];

const DOC_TAGS = [
  { pattern: /\bnota\s+fiscal\b/i, tag: 'Com Nota Fiscal' },
  { pattern: /\bcaixa\b/i, tag: 'Com Caixa' },
  { pattern: /\bpap[eé]is?\b/i, tag: 'Com Papéis' },
  { pattern: /\bcertificado\b/i, tag: 'Com Certificado' },
  { pattern: /\bgarantia\b/i, tag: 'Com Garantia' },
  { pattern: /\blaud[oa]\b/i, tag: 'Com Laudo' },
];

const STORAGE_RE = /\b(\d{3,4}\s*GB)\b/i;
const SCREEN_RE = /\b(\d{1,2}(?:[.,]\d)?\s*")\s*(?:polegadas?)?\b/i;
const SHOE_SIZE_RE = /\b(?:tamanho|tam\.?)\s*(\d{2})\b/i;

const COLORS: [RegExp, string][] = [
  [/\bpret[ao]\b/i, 'Preto'],
  [/\bbranco\b/i, 'Branco'],
  [/\bprata\b/i, 'Prata'],
  [/\bdourad[ao]\b/i, 'Dourado'],
  [/\bazul\b/i, 'Azul'],
  [/\bvermelho\b/i, 'Vermelho'],
  [/\bverde\b/i, 'Verde'],
  [/\bamarel[ao]\b/i, 'Amarelo'],
  [/\bcinza\b/i, 'Cinza'],
  [/\brosa\b/i, 'Rosa'],
  [/\blaranja\b/i, 'Laranja'],
  [/\bbeige\b/i, 'Bege'],
  [/\bbege\b/i, 'Bege'],
  [/\bcamel\b/i, 'Camel'],
];

const STOP_WORDS = new Set([
  'com', 'sem', 'para', 'por', 'que', 'uma', 'uns', 'umas', 'mais', 'muito',
  'anos', 'meses', 'aceito', 'preciso', 'quero', 'busco', 'procuro', 'gostaria',
  'ótimo', 'bom', 'boa', 'estado', 'apenas', 'usado', 'uso', 'direto', 'original',
]);

export function extractTags(
  product: string,
  brand: string,
  characteristics: string,
  description: string,
): string[] {
  const combined = [product, brand, characteristics, description].join(' ');
  const tags: string[] = [];

  for (const { pattern, tag } of CONDITION_TAGS) {
    if (pattern.test(combined) && !tags.includes(tag)) tags.push(tag);
  }
  for (const { pattern, tag } of DOC_TAGS) {
    if (pattern.test(combined) && !tags.includes(tag)) tags.push(tag);
  }

  const storage = combined.match(STORAGE_RE);
  if (storage) tags.push(storage[1].toUpperCase().replace(/\s/g, ''));

  const screen = combined.match(SCREEN_RE);
  if (screen) tags.push(screen[1].replace(/\s/g, '') + (screen[1].includes('"') ? '' : '"'));

  const shoe = combined.match(SHOE_SIZE_RE);
  if (shoe) tags.push(`Tam. ${shoe[1]}`);

  for (const [re, label] of COLORS) {
    if (re.test(combined) && !tags.includes(label)) tags.push(label);
  }

  // significant words from all fields (capitalized, not stop words, min 4 chars)
  const allWords = [product, brand, characteristics, description].join(' ').split(/\W+/).filter(w =>
    w.length >= 4 && !STOP_WORDS.has(w.toLowerCase()) && /^[A-ZÀ-Ü]/i.test(w)
  );
  for (const w of allWords) {
    const cap = w.charAt(0).toUpperCase() + w.slice(1);
    if (!tags.includes(cap)) tags.push(cap);
  }

  return tags.slice(0, 12);
}
