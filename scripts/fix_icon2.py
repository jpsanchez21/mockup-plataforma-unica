import re

path = 'src/components/Dashboard.tsx'
with open(path, encoding='utf-8') as f:
    content = f.read()

m = re.search(r'strokeWidth="3" className="text-white">.*?</svg>', content, re.DOTALL)
if m:
    old = m.group()
    new = '''strokeWidth="2.5" className="text-white">
                       <polyline points="17 1 21 5 17 9" />
                       <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                       <polyline points="7 23 3 19 7 15" />
                       <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                     </svg>'''
    content = content.replace(old, new, 1)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('Replaced OK')
else:
    print('NOT FOUND')
