import zipfile
import io
import csv
import re
import html

def clean_text_copy(raw_html):
    if not raw_html:
        return "", []
    
    text = html.unescape(raw_html)
    # Extract list items if present
    list_items = re.findall(r'<li[^>]*>(.*?)</li>', text, flags=re.DOTALL | re.IGNORECASE)
    cleaned_items = []
    for item in list_items:
        clean_item = re.sub(r'<[^>]+>', '', item).strip()
        clean_item = clean_item.replace('\ufffd', "'").replace('&nbsp;', ' ')
        clean_item = re.sub(r'\s+', ' ', clean_item)
        if clean_item and len(clean_item) > 3:
            cleaned_items.append(clean_item)
            
    # Strip remaining HTML tags
    clean_body = re.sub(r'<br\s*/?>', '\n', text, flags=re.IGNORECASE)
    clean_body = re.sub(r'</p>', '\n\n', clean_body, flags=re.IGNORECASE)
    clean_body = re.sub(r'<[^>]+>', ' ', clean_body)
    clean_body = clean_body.replace('\ufffd', "'").replace('&nbsp;', ' ')
    clean_body = re.sub(r'[ \t]+', ' ', clean_body)
    clean_body = re.sub(r'\n{3,}', '\n\n', clean_body).strip()
    
    return clean_body, cleaned_items

def clean_product_title(title):
    if not title:
        return ""
    
    t = html.unescape(title)
    # Fix encoding artifacts
    t = t.replace('\ufffd', "'").replace('\u00a0', ' ')
    t = re.sub(r'\s+', ' ', t).strip()
    
    # Normalize brand capitalization
    t = re.sub(r'\bplayr\b', 'playR', t, flags=re.IGNORECASE)
    
    # Remove awkward stuttering repetitions
    t = re.sub(r'\b(Pack of \d+)\s+\1\b', r'\1', t, flags=re.IGNORECASE)
    t = re.sub(r'\b(T-Shirt|Tee)\s+\1\b', r'\1', t, flags=re.IGNORECASE)
    
    # Clean up redundant marketplace keyword stuffing at the end
    # Matches patterns like "- Lightweight Durable ... All Season"
    t = re.sub(r'\s*[-–—]\s*(?:Lightweight|Durable|Breathable|Comfortable|Multipurpose|All Season|Comfort Fit|Daily Use|For Men & Women|For Men|For Women|For Kids|For Adult).*$', '', t, flags=re.IGNORECASE)
    
    # Remove trailing junk and fix punctuation
    t = re.sub(r'\s*[-–—]\s*[-–—]\s*', ' – ', t)
    t = re.sub(r'\s*[-–—]\s*$', '', t).strip()
    t = re.sub(r'[,;]\s*$', '', t).strip()
    
    return t

zf = zipfile.ZipFile(r'C:\Users\aashi\Downloads\products_export_1.zip')
with zf.open('products_export_1.csv') as f:
    wrapper = io.TextIOWrapper(f, encoding='utf-8')
    reader = csv.reader(wrapper)
    headers = next(reader)
    h_idx = headers.index('Handle')
    t_idx = headers.index('Title')
    b_idx = headers.index('Body (HTML)')
    s_idx = headers.index('Status')
    
    tested = 0
    for r in reader:
        h = r[h_idx]
        title = r[t_idx]
        body = r[b_idx]
        status = r[s_idx] if s_idx < len(r) else ''
        if h and title and (status.lower() == 'active' or status == ''):
            cleaned_t = clean_product_title(title)
            body_text, bullets = clean_text_copy(body)
            print(f"HANDLE: {h}")
            print(f"ORIGINAL TITLE: {title}")
            print(f"CLEANED TITLE : {cleaned_t}")
            print(f"BULLETS COUNT : {len(bullets)}")
            if bullets:
                print(f"SAMPLE BULLET : {bullets[0]}")
            print(f"BODY EXCERPT  : {body_text[:120]}...")
            print("=" * 60)
            tested += 1
            if tested >= 5:
                break
