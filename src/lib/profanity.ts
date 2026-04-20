const DEFAULT_PROFANITY = [
  'damn',
  'hell',
  'crap',
  'shit',
  'fuck',
  'bitch',
  'asshole',
];

const LEET_MAP: Record<string, string> = {
  '0': 'o',
  '1': 'i',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '7': 't',
  '@': 'a',
  '$': 's',
  '!': 'i',
};

function normalizeText(value: string): string {
  const mapped = value
    .toLowerCase()
    .split('')
    .map((char) => LEET_MAP[char] ?? char)
    .join('');

  return mapped
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/([a-z])\1{2,}/g, '$1$1')
    .trim();
}

function getProfanityList(): string[] {
  const envList = process.env.PROFANITY_WORDS;
  if (!envList) {
    return DEFAULT_PROFANITY;
  }

  const parsed = envList
    .split(',')
    .map((word) => word.trim().toLowerCase())
    .filter(Boolean);

  return parsed.length > 0 ? parsed : DEFAULT_PROFANITY;
}

export function findProfanity(text: string): string[] {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const normalized = normalizeText(text);
  if (!normalized) {
    return [];
  }

  const words = normalized.split(/\s+/g);
  const profanity = getProfanityList();
  const hits = new Set<string>();

  for (const word of words) {
    if (profanity.includes(word)) {
      hits.add(word);
    }
  }

  return Array.from(hits);
}
