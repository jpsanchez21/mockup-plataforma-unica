import re

path = 'src/components/Dashboard.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Regex to match the legend div regardless of specific indentation spacing
# Matches from <div className="w-[60px] ... to the closing </div>
pattern = r'( +)<div className="w-\[60px\] flex flex-col justify-center gap-2 border-l border-white/5 pl-2 shrink-0">.*?</div>\s+</div>'

def replacer(match):
    indent = match.group(1)
    # The actual inner content we want to preserve but clean up
    # However, since it's small, I'll just rewrite it clearly
    new_block = f"""{indent}{{chartType8 === 'ciclo' && (
{indent}   <div className="w-[60px] flex flex-col justify-center gap-2 border-l border-white/5 pl-2 shrink-0">
{indent}      <div className="flex flex-col items-center gap-1">
{indent}          <div className="w-8 h-4 rounded bg-[#09BC96]" />
{indent}          <span className="text-[7px] text-white font-bold uppercase truncate">Sencillo</span>
{indent}      </div>
{indent}      <div className="flex flex-col items-center gap-1">
{indent}          <div className="w-8 h-4 rounded bg-[#0B5799]" />
{indent}          <span className="text-[7px] text-white font-bold uppercase truncate">Doble</span>
{indent}      </div>
{indent}   </div>
{indent})}}"""
    return new_block

# Use re.DOTALL to match across lines
new_content = re.sub(pattern, replacer, content, flags=re.DOTALL)

if new_content != content:
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("REPLACED SUCCESSFULLY WITH REGEX")
else:
    print("REGEX NOT MATCHED")
