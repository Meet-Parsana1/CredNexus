import sys, io, re, json, hashlib, urllib.request, time, os
from datetime import datetime, timezone

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

UA = 'CredNexus-SIH2026/1.0 (contact@crednexus.gov.in)'
NOW = datetime.now(timezone.utc).isoformat()
SOURCE_URL = 'https://nsfdc.nic.in/scheme'

def fetch(url, delay=1):
    time.sleep(delay)
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=15) as r:
        return r.read()

def strip_html(s):
    s = re.sub(r'<[^>]+>', ' ', s)
    s = s.replace('&amp;', 'and').replace('&nbsp;', ' ').replace('&lt;','<').replace('&gt;','>').replace('&quot;','""')
    return re.sub(r'\s+', ' ', s).strip()

print('[1] Fetching', SOURCE_URL)
raw = fetch(SOURCE_URL, delay=0)
sha = hashlib.sha256(raw).hexdigest()
html = raw.decode('utf-8', errors='replace')
print('    Bytes:', len(raw), '  SHA256:', sha[:16])

pattern = re.compile(r'<!--\s*(\d+)\.\s*(.*?)-->(.*?)(?=<!--\s*\d+\.|$)', re.DOTALL)
sections = pattern.findall(html)
print('[2] Scheme sections found:', len(sections))

parsed = []
for num_s, name_raw, body in sections:
    num = int(num_s)
    name = strip_html(name_raw)
    if not name.strip() or num > 10:
        continue
    pairs = re.findall(r'<h4[^>]*>(.*?)</h4>\s*<p[^>]*>(.*?)</p>', body, re.DOTALL)
    fields = {}
    for h, p in pairs:
        fk = strip_html(h)
        fv = strip_html(p)
        if fk:
            fields[fk] = fv
    tables = re.findall(r'<table[^>]*>(.*?)</table>', body, re.DOTALL)
    table_text = strip_html(tables[0]) if tables else ''
    print(f'\n  {num}: {name}')
    for k,v in list(fields.items())[:5]:
        safe_v = v[:80].encode('ascii', errors='replace').decode('ascii')
        print(f'    {k}: {safe_v}')
    if table_text:
        safe_t = table_text[:120].encode('ascii', errors='replace').decode('ascii')
        print(f'    TABLE: {safe_t}')
    parsed.append({'num': num, 'name': name, 'fields': fields, 'table_text': table_text})

output = {
    'scraped_at': NOW,
    'source_url': SOURCE_URL,
    'source_hash': sha,
    'sections': parsed
}
out_file = os.path.join(os.path.dirname(__file__), 'nsfdc_scraped_raw.json')
with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)
print('\n[3] Saved to', out_file)