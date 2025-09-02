from pathlib import Path
import io
from pypdf import PdfReader
p = Path('c:/123456/corba/out_main_full_test.pdf')
if not p.exists():
    print('no file')
else:
    data = p.read_bytes()
    r = PdfReader(io.BytesIO(data))
    print('pages:', len(r.pages))
