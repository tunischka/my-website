/* Central tag registry  – add / remove only here */
  export const TAGS = [
    { id: 'forensics',        label: 'Forensics' },
    { id: 'malware',          label: 'Malware' },
    { id: 'ctf',              label: 'CTF' },
    { id: 'web-exploitation', label: 'Web-Exploitation' },
    // gerekiyorsa yenilerini de buraya ekle
  ];
  
  /**
   * Golden Angle yöntemiyle index'e göre renk üretir.
   * index: TAGS dizisindeki pozisyon (0,1,2...)
   */
  const GOLDEN_ANGLE = 137.508;  // derece
  
  export function colourOfIndex(index) {
    const hue = (index * GOLDEN_ANGLE) % 360;
    return {
      text:  `hsl(${hue} 60% 35%)`,            // koyu metin rengi
      fill:  `hsla(${hue} 70% 45% / .18)`      // pastel dolgu
    };
  }
