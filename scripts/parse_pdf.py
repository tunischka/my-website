# scripts/parse_pdf.py
import json, re
from pathlib import Path
from pdfminer.high_level import extract_text

ROOT = Path(__file__).resolve().parents[1]
PDF  = ROOT / "content" / "cv" / "cv.pdf"
OUT  = ROOT / "data" / "cv.json"
OUT.parent.mkdir(parents=True, exist_ok=True)

text = extract_text(str(PDF)) or ""
# satırları sadeleştir
lines = [re.sub(r"\s+", " ", l).strip() for l in text.splitlines()]
lines = [l for l in lines if l]
full  = "\n".join(lines)

# 1) önce görünmez tag varsa ona göre böl
def take(tag):
  m = re.search(rf"\[{tag}\](.*?)(?=\[[A-Z]+\]|$)", full, flags=re.S)
  return m.group(1).strip() if m else None

sections = {}
TAGS = ["SUMMARY","EXPERIENCE","EDUCATION","PROJECTS","SKILLS","CERTS","LANGUAGES"]
tagged = False
for t in TAGS:
  blk = take(t)
  if blk:
    sections[t] = blk; tagged = True

# 2) tag yoksa KLASİK başlıklara göre böl
if not tagged:
  header = re.compile(r"(?m)^(SUMMARY|EXPERIENCE|EDUCATION|PROJECTS|SKILLS|CERTIFICATIONS|CERTS|LANGUAGES)\s*$")
  parts = header.split(full)
  if len(parts) > 1:
    for i in range(1, len(parts), 2):
      h = parts[i].upper()
      if h == "CERTIFICATIONS": h = "CERTS"
      sections[h] = parts[i+1].strip()
  else:
    sections["SUMMARY"] = full

def split_bullets(block):
  return [x.strip("•-– ").strip() for x in block.split("\n") if x.strip()]

def parse_experience(block):
  items = []
  # kaba: tarih/ @ / ' at ' gördükçe yeni iş
  for chunk in re.split(r"(?:\n){1,}", block):
    if not items or re.search(r"(20\d{2}|19\d{2}|\bat\b| @ )", chunk, re.I):
      items.append({"_buf":[chunk]})
    else:
      items[-1]["_buf"].append(chunk)
  for it in items:
    lines = [l.strip() for l in it["_buf"] if l.strip()]
    it["title_line"] = lines[0] if lines else ""
    it["highlights"] = [l.strip("•-– ").strip() for l in lines[1:]]
    it.pop("_buf", None)
  return items

cv = {}
if "SUMMARY" in sections: cv["summary"] = sections["SUMMARY"]
if "EXPERIENCE" in sections: cv["experience"] = parse_experience(sections["EXPERIENCE"])
if "EDUCATION" in sections: cv["education"] = split_bullets(sections["EDUCATION"])
if "PROJECTS" in sections:  cv["projects"]  = split_bullets(sections["PROJECTS"])
if "SKILLS" in sections:    cv["skills"]    = split_bullets(sections["SKILLS"])
if "CERTS" in sections:     cv["certifications"] = split_bullets(sections["CERTS"])
if "LANGUAGES" in sections: cv["languages"] = split_bullets(sections["LANGUAGES"])

OUT.write_text(json.dumps(cv, ensure_ascii=False, indent=2), encoding="utf-8")
print("cv.json yazıldı:", OUT)
