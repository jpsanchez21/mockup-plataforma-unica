import re

path = 'src/components/Dashboard.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern for the metric grid block
pattern = r'( +)<div className=\"glass-panel flex-\[1\.4\] grid grid-cols-2 grid-rows-3 gap-2 bg-black/20 p-2 overflow-hidden\">.*?</div>'

replacement_grid = """             <div className="flex-[1.4] grid grid-cols-2 grid-rows-3 gap-2 p-0 overflow-hidden">
                <TileBox lbl="Barriles por Minuto" v={latestPoint?.flow?.toFixed(1) || "0.0"} u="Bbls/min" min="0" max="15" />
                <TileBox lbl="Presión Bomba" v={latestPoint?.pump?.toFixed(0) || "0"} u="psi" min="0" max="3000" />
                <TileBox lbl="RPM Mesa Rotaria" v={latestPoint?.spm?.toFixed(0) || "0"} u="rpm" min="0" max="200" />
                <TileBox lbl="Torque Mesa Rotaria" v={latestPoint?.torque?.toFixed(0) || "0"} u="lbs-ft" min="0" max="15000" />
                <TileBox lbl="Peso Sobre Broca" v={latestPoint?.wob?.toFixed(1) || "0.0"} u="Klb" min="-30" max="30" />
                <TileBox lbl="ROP" v={latestPoint?.blockVel?.toFixed(1) || "0.0"} u="ft/min" min="0" max="350" />
             </div>"""

# Standardize newlines for replacement
new_content = re.sub(pattern, replacement_grid, content, flags=re.DOTALL)

if new_content != content:
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("SUCCESSFULLY REPLACED GRID")
else:
    print("GRID NOT FOUND")
