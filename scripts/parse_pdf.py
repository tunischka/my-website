import json, re, sys
from pathlib import Path
from typing import Optional
from pdfminer.high_level import extract_text
from pdfminer.layout import LAParams

ROOT = Path(__file__).resolve().parents[1]
PDF_DIR = ROOT / "content" / "cv"
OUT = ROOT / "data" / "cv.json"
OUT.parent.mkdir(parents=True, exist_ok=True)

def find_latest_pdf(dirpath: Path) -> Optional[Path]:
    pdfs = sorted(dirpath.glob("*.pdf"), key=lambda p: p.stat().st_mtime, reverse=True)
    return pdfs[0] if pdfs else None

pdf_path = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else find_latest_pdf(PDF_DIR)
if not pdf_path or not pdf_path.exists():
    raise FileNotFoundError(f"PDF bulunamadı: {PDF_DIR} veya argüman ile verin.")

# --- 1) PDF -> text (satırları mümkün olduğunca koru)
laparams = LAParams(line_margin=0.2, word_margin=0.1)  # düzeni biraz daha iyi koru
raw = extract_text(str(pdf_path), laparams=laparams) or ""

# --- 2) Normalizasyon yardımcıları
def collapse_letterspaced_headers(s: str) -> str:
    """
    'P R O F I L E' -> 'PROFILE'
    'W O R K  E X P E R I E N C E' -> 'WORK EXPERIENCE'
    sadece TAMAMEN büyük harfli kelimelerde boşlukları kaldırır.
    """
    def _fix_line(line: str) -> str:
        # bir satırda sadece A-Z ve boşluklardan oluşan uzun parçaları hedefle
        # ayrıca iki kelime arası çift/üç boşluk varsa tek boşluğa indir
        line = re.sub(r'\s{2,}', '  ', line)
        parts = []
        for token in line.split('  '):  # iki boşluk, kelime ayırıcı gibi
            if re.fullmatch(r'[A-Z\s&]+', token.strip()):
                parts.append(token.replace(' ', ''))  # tüm boşlukları kaldır: E D U C A T I O N -> EDUCATION
            else:
                parts.append(token)
        return ' '.join(p for p in parts if p is not None).strip()
    fixed = []
    for l in s.splitlines():
        fixed.append(_fix_line(l))
    return "\n".join(fixed)

def fix_broken_urls(s: str) -> str:
    # 'l inkedin' gibi tek harf arası boşluğu kaldır
    s = re.sub(r'(https?://\S+)', lambda m: m.group(1).replace(' ', ''), s)
    s = s.replace('www.l inkedin.com', 'www.linkedin.com')
    s = s.replace('github .com', 'github.com')
    return s

def normalize(s: str) -> str:
    s = s.replace('\u2019', "'").replace('\u2013', '-').replace('\u2014', '-')
    s = collapse_letterspaced_headers(s)
    s = fix_broken_urls(s)
    # satır sonlarında gereksiz çoklu boşlukları temizle
    lines = [re.sub(r'\s+', ' ', l).strip() for l in s.splitlines()]
    # boş olmayan satırlar
    return "\n".join([l for l in lines if l])

text = normalize(raw)

# --- 3) Bölümleri çıkar
# Başlık seti (hem eski hem yeni varyantlar)
HEADERS = [
    "PROFILE",
    "EDUCATION",
    "WORK EXPERIENCE",
    "EXPERIENCE",            # bazen kısaltılmış olabilir
    "SKILLS & PROJECTS",
    "SKILLS",
    "PROJECTS",
    "LANGUAGES",
    "CERTIFICATES",
    "CERTIFICATIONS",
    "PORTFOLIO",
    "CONTACT",
]

# Çok satırlı split: başlık satırı teke indirilecek
hdr_pat = re.compile(r'(?m)^(' + '|'.join(re.escape(h) for h in HEADERS) + r')$')

parts = hdr_pat.split(text)
# parts: [before, H1, afterH1, H2, afterH2, ...]
sections = {}
preface = parts[0].strip() if parts else ""
if preface:
    sections["PROFILE"] = sections.get("PROFILE", preface)

for i in range(1, len(parts), 2):
    h = parts[i].upper().strip()
    body = parts[i+1].strip()
    # normalize eş başlıklar
    if h == "CERTIFICATIONS": h = "CERTIFICATES"
    if h == "EXPERIENCE": h = "WORK EXPERIENCE"
    sections[h] = body

def bullets(block: str):
    items = []
    for l in block.split('\n'):
        l = l.strip().lstrip('•-–·')
        if l:
            items.append(l)
    return items

def parse_experience(block: str):
    # kabaca, iş başlıklarını tarih/@/yer ipuçları ile ayır
    lines = [l for l in block.split('\n') if l]
    groups, cur = [], []
    for l in lines:
        if re.search(r'(20\d{2}|19\d{2}| - |\b/\b|, ?[A-Z][a-z]+(?:, ?[A-Z]{2})?)', l) and cur:
            groups.append(cur); cur = []
        cur.append(l)
    if cur: groups.append(cur)

    out = []
    for g in groups:
        title = g[0]
        hl = [x for x in g[1:] if len(x) > 2]
        out.append({"title_line": title, "highlights": hl})
    return out

cv = {}
if "PROFILE" in sections:
    # PROFILE genelde paragraf
    cv["summary"] = sections["PROFILE"]
if "EDUCATION" in sections:
    cv["education"] = bullets(sections["EDUCATION"])
if "WORK EXPERIENCE" in sections:
    cv["experience"] = parse_experience(sections["WORK EXPERIENCE"])
if "PROJECTS" in sections or "SKILLS & PROJECTS" in sections:
    cv["projects"] = bullets(sections.get("PROJECTS", sections.get("SKILLS & PROJECTS","")))
if "SKILLS" in sections:
    cv["skills"] = bullets(sections["SKILLS"])
if "LANGUAGES" in sections:
    cv["languages"] = bullets(sections["LANGUAGES"])
if "CERTIFICATES" in sections:
    cv["certifications"] = bullets(sections["CERTIFICATES"])
if "PORTFOLIO" in sections:
    cv["portfolio"] = bullets(sections["PORTFOLIO"])
if "CONTACT" in sections:
    cv["contact"] = bullets(sections["CONTACT"])

OUT.write_text(json.dumps(cv, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"OK: {pdf_path.name} -> {OUT}")
