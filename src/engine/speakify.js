const ONES = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
];

const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

export function numberToWords(n) {
  const num = Math.round(Number(n));
  if (num < 0) return 'negative ' + numberToWords(-num);
  if (num < 20) return ONES[num];
  if (num < 100) return TENS[Math.floor(num / 10)] + (num % 10 ? '-' + ONES[num % 10] : '');
  if (num < 1000) return ONES[Math.floor(num / 100)] + ' hundred' + (num % 100 ? ' and ' + numberToWords(num % 100) : '');
  return String(num);
}

export function toSpeech(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/∠\s?([A-Z]{3})/g, (_, l) => 'angle ' + l.split('').join(' '))
    .replace(/(\d+)x/g, (_, n) => `${numberToWords(+n)} x`)
    .replace(/(\d+)\s?°/g, (_, n) => `${numberToWords(+n)} degrees`)
    .replace(/°/g, ' degrees')
    .replace(/\s\+\s/g, ' plus ')
    .replace(/\s[−-]\s/g, ' minus ')
    .replace(/\s=\s/g, ' equals ')
    .replace(/\b(\d+)\b/g, (_, n) => numberToWords(+n))
    .replace(/[()]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export const speakify = toSpeech;
