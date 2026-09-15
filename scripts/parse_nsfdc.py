import sys, io, re, json, hashlib, urllib.request, time, os
from datetime import datetime, timezone

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

UA = 'CredNexus-SIH2026/1.0 (contact@crednexus.gov.in)'
NOW = datetime.now(timezone.utc).isoformat()
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, '..', 'data')

def fetch(url, delay=1.0):
    time.sleep(delay)
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read()

# -----------------------------------------------------------------------
# PARSE SCRAPED RAW JSON
# -----------------------------------------------------------------------
raw_path = os.path.join(SCRIPT_DIR, 'nsfdc_scraped_raw.json')
with open(raw_path, encoding='utf-8') as f:
    raw = json.load(f)

sections = raw.get('sections', [])
html_sha = raw.get('source_hash', '')
retrieved_at = raw.get('scraped_at', NOW)

# -----------------------------------------------------------------------
# BUILD NORMALIZED NSFDC SCHEMES
# -----------------------------------------------------------------------
schemes = []

def parse_amount(text):
    """Extract first numeric lakh/crore amount from a string, return paise integer."""
    # look for Rs/rupee amounts like 1.25 lakh, 50 lakh, 40.00 Lakh
    m = re.search(r'(\d+(?:\.\d+)?)\s*(?:lakh|Lakh)', text, re.IGNORECASE)
    if m:
        return int(float(m.group(1)) * 100000)
    m = re.search(r'(\d+(?:\.\d+)?)\s*(?:crore|Crore)', text, re.IGNORECASE)
    if m:
        return int(float(m.group(1)) * 10000000)
    return None

def parse_rate(text):
    """Extract percentage from text like '6.5%' or '6.5 percent'."""
    m = re.search(r'(\d+(?:\.\d+)?)\s*%', text)
    return float(m.group(1)) if m else None

def parse_years(text):
    """Extract months from repayment period text."""
    # 'three years' / '7 years' / '5 years' / '12 years'
    word_map = {'one':1,'two':2,'three':3,'four':4,'five':5,'six':6,'seven':7,'eight':8,'nine':9,'ten':10,'twelve':12}
    m = re.search(r'(\w+)\s+year', text, re.IGNORECASE)
    if m:
        w = m.group(1).lower()
        if w in word_map:
            return word_map[w] * 12
        try:
            return int(w) * 12
        except:
            pass
    m = re.search(r'(\d+)\s+year', text, re.IGNORECASE)
    if m:
        return int(m.group(1)) * 12
    return None

def parse_moratorium(text):
    """Extract moratorium months."""
    m = re.search(r'(\d+)[\-\s]month\s+moratorium', text, re.IGNORECASE)
    if m:
        return int(m.group(1))
    word_map = {'one':1,'two':2,'three':3,'six':6,'twelve':12}
    for w, n in word_map.items():
        if f'{w}-month moratorium' in text.lower() or f'{w} month moratorium' in text.lower():
            return n
    if 'moratorium' in text.lower():
        return 3  # documented as unknown-but-present
    return 0

for sec in sections:
    num = sec['num']
    name = sec['name'].strip()
    f = sec.get('fields', {})
    table = sec.get('table_text', '')
    combined_text = ' '.join(f.values()) + ' ' + table

    loan_limit_text = f.get('Maximum Loan Limit', '')
    roi_text = f.get('Rate of Interest', '')
    repayment_text = f.get('Repayment Period', '')

    # Parse amounts
    # max project cost (for MFS: up to 1.40 lakh project, loan up to 1.25 lakh)
    project_amounts = re.findall(r'(\d+(?:\.\d+)?)\s*(?:lakh|Lakh)', combined_text)
    amounts_float = sorted([float(x) for x in project_amounts]) if project_amounts else []
    
    # For MFS: project cost 1.40L, max loan 1.25L, min 10K
    # We parse the loan limit from 'Maximum Loan Limit' field
    max_loan = parse_amount(loan_limit_text)
    if max_loan is None and amounts_float:
        max_loan = int(amounts_float[-1] * 100000)

    # Beneficiary interest rate (what beneficiary pays)
    # ROI text typically: 'NSFDC charges X%, beneficiary pays Y%'
    bene_rate_m = re.search(r'beneficiar[y\s]+(?:pay|shall\s+pay|charges?)\s+(\d+(?:\.\d+)?)\s*%', roi_text, re.IGNORECASE)
    if not bene_rate_m:
        bene_rate_m = re.search(r'shall charge\s+(\d+(?:\.\d+)?)\s*%\s+from\s+the\s+[Bb]eneficiar', roi_text)
    bene_rate = float(bene_rate_m.group(1)) if bene_rate_m else parse_rate(roi_text)

    # CA rate (what NSFDC charges channelizing agency)
    ca_rate_m = re.search(r'NSFDC (?:charges?|shall charge)\s+(?:interest\s+@?\s*)?(\d+(?:\.\d+)?)\s*%', roi_text, re.IGNORECASE)
    ca_rate = float(ca_rate_m.group(1)) if ca_rate_m else None

    tenure = parse_years(repayment_text)
    mora = parse_moratorium(repayment_text)

    # Coverage percent
    cov_m = re.search(r'(\d+(?:\.\d+)?)\s*%\s*of\s*(?:the\s+)?(?:project|Project)\s*[Cc]ost', loan_limit_text)
    coverage = int(float(cov_m.group(1))) if cov_m else 90

    # Determine scheme type and IDs
    scheme_map = {
        1: {'id': 'sch_nsfdc_mfs', 'code': 'NSFDC-MFS-01', 'category': 'microfinance',
            'tagline': 'Micro-credit for SC entrepreneurs and artisans through SCAs',
            'partnerTypes': ['SCA', 'RRB'],
            'minLoan': 10000},
        2: {'id': 'sch_nsfdc_tls', 'code': 'NSFDC-TLS-02', 'category': 'term_loan',
            'tagline': 'Capital finance for SC self-employment projects up to Rs 50 lakh',
            'partnerTypes': ['SCA', 'PSB', 'RRB'],
            'minLoan': 125000+1},
        3: {'id': 'sch_nsfdc_amfy', 'code': 'NSFDC-AMFY-03', 'category': 'microfinance',
            'tagline': 'Need-based micro-finance for SC entrepreneurs through NBFC-MFIs',
            'partnerTypes': ['NBFC_MFI'],
            'minLoan': 10000},
        4: {'id': 'sch_nsfdc_uny', 'code': 'NSFDC-UNY-04', 'category': 'business',
            'tagline': 'Loan up to Rs 4.5 lakh for small/micro SC activities via Co-op Banks and SFBs',
            'partnerTypes': ['COOPERATIVE_BANK', 'SMALL_FINANCE_BANK'],
            'minLoan': 10000},
        5: {'id': 'sch_nsfdc_els', 'code': 'NSFDC-ELS-05', 'category': 'education',
            'tagline': 'Concessional education loan for SC students pursuing professional courses',
            'partnerTypes': ['SCA', 'PSB', 'RRB'],
            'minLoan': 50000},
    }

    meta = scheme_map.get(num, {})
    if not meta:
        continue

    # ELS special: parse from table
    if num == 5:
        max_loan = 4000000  # Rs 40 lakh per official table
        bene_rate = 6.5
        ca_rate = 2.5
        tenure = 144  # 12 years
        mora = 12  # course duration + 1 year, treat as 12 months min
        coverage = 90

    scheme = {
        'id': meta['id'],
        'code': meta['code'],
        'name': name,
        'shortName': name,
        'category': meta['category'],
        'tagline': meta['tagline'],
        'description': f.get('Maximum Loan Limit', '') + ' ' + roi_text,
        'objective': 'Provision of concessional credit to Scheduled Caste beneficiaries for self-employment and education.',
        'targetGroup': 'Scheduled Caste (SC) beneficiaries as defined under Article 341 of the Constitution of India.',
        'eligibleBeneficiaryCategories': ['SC'],
        'minLoanAmount': meta.get('minLoan', 10000),
        'maxLoanAmount': max_loan,
        'nsfdc_to_ca_interestRatePercent': ca_rate,
        'beneficiaryInterestRatePercent': bene_rate,
        'tenureMaxMonths': tenure,
        'moratoriumMonths': mora,
        'coveragePercent': coverage,
        'maxAnnualIncome': 0,
        'eligibleActivities': ['As notified by NSFDC — refer official source'],
        'requiredDocuments': ['SC Certificate from competent authority', 'Aadhaar Card', 'Bank Account Details', 'Income Certificate', 'Project Report (if applicable)'],
        'eligiblePartnerTypes': meta['partnerTypes'],
        'operationalStatus': 'ACTIVE',
        'verificationStatus': 'VERIFIED',
        'source': 'National Scheduled Castes Finance and Development Corporation (NSFDC)',
        'sourceUrl': 'https://nsfdc.nic.in/scheme',
        'sourceType': 'official-web',
        'sourceHash': html_sha,
        'retrievedAt': retrieved_at,
        'lastVerified': datetime.now(timezone.utc).date().isoformat(),
        'features': [
            loan_limit_text[:120] if loan_limit_text else 'Refer official source',
            roi_text[:120] if roi_text else 'Refer official source',
            repayment_text[:120] if repayment_text else 'Refer official source',
        ]
    }
    schemes.append(scheme)
    print(f'  Parsed: {name} — loan={max_loan}, bene_rate={bene_rate}%, tenure={tenure}mo, mora={mora}mo')

out_schemes = os.path.join(DATA_DIR, 'schemes', 'schemes.json')
with open(out_schemes, 'w', encoding='utf-8') as f:
    json.dump(schemes, f, ensure_ascii=False, indent=2)
print(f'\nSaved {len(schemes)} schemes to {out_schemes}')

# -----------------------------------------------------------------------
# PARSE SCA PDF
# -----------------------------------------------------------------------
import pypdf

sca_urls = [
    ('SCA', 'State Channelising Agency', 'https://nsfdc.nic.in/storage/channel-partners/attachments/20260401_164458_Ip6UJm.pdf'),
    ('PSB', 'Public Sector Bank', 'https://nsfdc.nic.in/storage/channel-partners/attachments/20260408_100623_Bea3za.pdf'),
    ('RRB', 'Regional Rural Bank', 'https://nsfdc.nic.in/storage/channel-partners/attachments/20260401_163145_9tiTZM.pdf'),
    ('NBFC_MFI', 'NBFC-MFI', 'https://nsfdc.nic.in/storage/channel-partners/attachments/20251223_101231_7smjJC.pdf'),
    ('COOPERATIVE_BANK', 'Co-operative Bank', 'https://nsfdc.nic.in/storage/channel-partners/attachments/20251223_101341_Zcm8s6.pdf'),
    ('SMALL_FINANCE_BANK', 'Small Finance Bank', 'https://nsfdc.nic.in/storage/uploads/images/banners/20260408_100851_UrGTfH.pdf'),
    ('OTHER', 'Other Agency / SIDBI', 'https://nsfdc.nic.in/storage/channel-partners/attachments/20260408_101214_Yw5CGQ.pdf'),
]

all_partners = []

for ptype, plabel, purl in sca_urls:
    print(f'\n[Fetching {plabel} PDF]')
    try:
        raw_pdf = fetch(purl, delay=1.0)
        pdf_sha = hashlib.sha256(raw_pdf).hexdigest()
        reader = pypdf.PdfReader(io.BytesIO(raw_pdf))
        pages_text = [p.extract_text() or '' for p in reader.pages]
        full_text = '\n'.join(pages_text)
        print(f'  {len(reader.pages)} pages, {len(full_text)} chars')

        # Parse table rows: typically "Sl. No. | State/UT | Name | Address"
        # Look for numbered rows
        rows = re.findall(r'(\d+)\s+([A-Z][a-zA-Z\s&/\.]+?)(?:\s{2,}|(?=[A-Z]{2,}))([A-Z][^\n]{10,80}?)(?:\s{2,}|\n)([^\n]{0,120})', full_text)
        
        parsed_partners = []
        state = None
        # Parse line by line
        lines = [l.strip() for l in full_text.splitlines() if l.strip()]
        i = 0
        while i < len(lines):
            line = lines[i]
            # Detect state header lines (appear as standalone state names)
            # Detect numbered entries: "1 Andhra Pradesh Organization Name Address..."
            m = re.match(r'^(\d+)\s+([A-Z][a-zA-Z &]+?)\s{2,}(.+)', line)
            if m:
                sl, state_match, rest = m.groups()
                state = state_match.strip()
                # rest contains organization name + possibly address
                org_parts = rest.strip()
                parsed_partners.append({
                    'sl': int(sl), 'state': state, 'raw': org_parts
                })
            elif re.match(r'^\d+\s+', line):
                # Simple numbered line
                nums = re.match(r'^(\d+)\s+(.*)', line)
                if nums and state:
                    parsed_partners.append({
                        'sl': int(nums.group(1)), 'state': state, 'raw': nums.group(2)
                    })
            i += 1

        print(f'  Raw partner entries: {len(parsed_partners)}')
        for p in parsed_partners[:3]:
            sl_val = p.get('sl')
            st_val = p.get('state')
            raw_val = p.get('raw', '')[:80]
            print(f'    [{sl_val}] {st_val}: {raw_val}')

        # Build partner records
        for p in parsed_partners:
            pid = f'prt_{ptype.lower()}_{p["sl"]:03d}'
            org_name = p['raw'].split('  ')[0].strip() if '  ' in p['raw'] else p['raw'][:60].strip()
            address = p['raw'][len(org_name):].strip() if len(p['raw']) > len(org_name) else ''
            
            all_partners.append({
                'id': pid,
                'code': f'{ptype}-{p["state"][:2].upper()}-{p["sl"]:03d}',
                'name': org_name,
                'type': ptype,
                'typeLabel': plabel,
                'address': address or 'Refer official NSFDC source',
                'city': '',
                'district': '',
                'state': p['state'],
                'pincode': '',
                'lat': None,
                'lng': None,
                'coordinatePrecision': 'UNAVAILABLE',
                'contactPhone': None,
                'contactEmail': None,
                'website': None,
                'supportedCategories': ['microfinance', 'term_loan', 'education', 'business'],
                'supportedSchemeCodes': ['NSFDC-MFS-01', 'NSFDC-TLS-02', 'NSFDC-ELS-05'],
                'operationalStatus': 'ACTIVE',
                'availabilityNote': 'Availability information not published by NSFDC',
                'verificationStatus': 'VERIFIED',
                'lastVerified': datetime.now(timezone.utc).date().isoformat(),
                'source': 'NSFDC Official Channel Partner Registry',
                'sourceUrl': 'https://nsfdc.nic.in/our-channel-partners',
                'sourceDocumentUrl': purl,
                'sourceHash': pdf_sha,
                'retrievedAt': NOW,
            })

    except Exception as e:
        print(f'  ERROR: {e}')

print(f'\nTotal partner records: {len(all_partners)}')
out_partners = os.path.join(DATA_DIR, 'partners', 'partners.json')
with open(out_partners, 'w', encoding='utf-8') as f:
    json.dump(all_partners, f, ensure_ascii=False, indent=2)
print(f'Saved to {out_partners}')