/* Central tag registry  – add / remove only here */
export const TAGS = [
    { id: 'forensics',        label: 'Forensics' },
    { id: 'malware',          label: 'Malware' },
    { id: 'ctf',              label: 'CTF' },
    { id: 'web-exploitation', label: 'Web-Exploitation' }
  ];
  
  /* Consistent pastel colours (hash → HSL) */
  export function colourOf(tag) {
    let hash = 0;
    for (let i = 0; i < tag.length; i++)
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    const hue = Math.abs(hash) % 360;
    return {
      text: `hsl(${hue} 60% 35%)`,
      fill: `hsla(${hue} 70% 45% / .18)`
    };
  }
  