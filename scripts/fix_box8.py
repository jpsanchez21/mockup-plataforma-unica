import re

path = r'src/components/Dashboard.tsx'
with open(path, encoding='utf-8') as f:
    content = f.read()

# 1. Fix the toggle button SVG (old lock icon -> swap arrows)
old_svg = (
    '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white">\n'
    '                         <path d="M7 11V7a5 5 0 0 1 10 0v4" /><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />\n'
    '                     </svg>'
)
new_svg = (
    '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white">\n'
    '                       <polyline points="17 1 21 5 17 9" />\n'
    '                       <path d="M3 11V9a4 4 0 0 1 4-4h14" />\n'
    '                       <polyline points="7 23 3 19 7 15" />\n'
    '                       <path d="M21 13v2a4 4 0 0 1-4 4H3" />\n'
    '                     </svg>'
)
if old_svg in content:
    content = content.replace(old_svg, new_svg, 1)
    print('SVG icon: OK')
else:
    print('SVG icon: NOT FOUND - skipping')

# 2. Show X and Y axes - replace `hide` axes and add labels
content = content.replace(
    '<XAxis dataKey="name" fontSize={7} stroke="#ffffff" tick={{ fill: \'#ffffff\' }} hide />',
    '<XAxis dataKey="name" fontSize={7} tick={{ fill: \'#ffffffaa\' }} tickLine={false} axisLine={{ stroke: \'#ffffff20\' }} height={16} />'
)
content = content.replace(
    '<YAxis fontSize={8} stroke="#ffffff" tick={{ fill: \'#ffffff\' }} hide domain={[0, chartType8 === \'ciclo\' ? 10 : 14]} />',
    '<YAxis fontSize={7} tick={{ fill: \'#ffffff99\' }} tickLine={false} axisLine={false} domain={[0, chartType8 === \'ciclo\' ? 10 : 14]} width={22} />'
)

# 3. Update margin to make room for axes
content = content.replace(
    'margin={{ top: 5, right: 0, left: -35, bottom: 0 }}',
    'margin={{ top: 4, right: 4, left: 0, bottom: 16 }}'
)

# 4. Remove the floating "minutos/juntas" label (replaced by Y axis)
content = content.replace(
    '                     <span className="absolute left-1 -top-4 text-[7px] font-bold text-white/40 uppercase italic">{chartType8 === \'ciclo\' ? \'minutos\' : \'juntas\'}</span>\n                     \n',
    ''
)

# 5. Adjust chart container top margin
content = content.replace(
    '<div className="flex-1 mt-10 relative overflow-hidden flex gap-2">',
    '<div className="flex-1 mt-7 relative overflow-hidden flex gap-1">'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done writing file.')
