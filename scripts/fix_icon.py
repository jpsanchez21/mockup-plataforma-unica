path = r'src/components/Dashboard.tsx'
with open(path, encoding='utf-8') as f:
    content = f.read()

# The file uses CRLF - find and replace the SVG icon using regex-free approach
old = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white">\r\n                         <path d="M7 11V7a5 5 0 0 1 10 0v4" /><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />\r\n                     </svg>'
new = '''<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white">
                       <polyline points="17 1 21 5 17 9" />
                       <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                       <polyline points="7 23 3 19 7 15" />
                       <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                     </svg>'''

if old in content:
    content = content.replace(old, new, 1)
    print('Icon replaced OK')
else:
    print('NOT FOUND with CRLF, trying LF...')
    old_lf = old.replace('\r\n', '\n')
    if old_lf in content:
        content = content.replace(old_lf, new, 1)
        print('Icon replaced OK (LF)')
    else:
        print('STILL NOT FOUND')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')
