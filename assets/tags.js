export const TAGS = [
  { id: 'forensics',        label: 'Forensics' },
  { id: 'malware',          label: 'Malware' },
  { id: 'ctf',              label: 'CTF' },
  { id: 'web-exploitation', label: 'Web-Exploitation' }
];

// Golden Angle renk dağıtımı
const GOLDEN_ANGLE = 137.508; // derece cinsinden

export function colourOfIndex(index) {
  const hue = (index * GOLDEN_ANGLE) % 360;
  return {
    text: `hsl(${hue} 60% 35%)`,      // metin rengi
    fill: `hsla(${hue} 70% 45% / 0.18)` // dolgu rengi
  };
}
