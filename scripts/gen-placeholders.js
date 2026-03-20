/**
 * Generates SVG placeholder hairstyle images in /public/hairstyles/
 * Run once: node scripts/gen-placeholders.js
 */
const fs = require('fs')
const path = require('path')

const hairstyles = [
  { id: 'pixie-cut',      label: 'Pixie Cut',        color: '#D4A0A0', hair: 'short'    },
  { id: 'bob-classic',    label: 'Classic Bob',       color: '#8B6347', hair: 'bob'      },
  { id: 'bob-wavy',       label: 'Wavy Bob',          color: '#C49A6C', hair: 'bob-wavy' },
  { id: 'undercut',       label: 'Undercut',          color: '#4A3728', hair: 'short'    },
  { id: 'lob-straight',   label: 'Straight Lob',      color: '#D4A854', hair: 'medium'   },
  { id: 'lob-wavy',       label: 'Wavy Lob',          color: '#B5835A', hair: 'med-wavy' },
  { id: 'wolf-cut',       label: 'Wolf Cut',          color: '#2C2C2C', hair: 'medium'   },
  { id: 'shag-cut',       label: 'Shag Cut',          color: '#8C4A2F', hair: 'medium'   },
  { id: 'butterfly-cut',  label: 'Butterfly Cut',     color: '#C9A96E', hair: 'medium'   },
  { id: 'long-straight',  label: 'Long Straight',     color: '#1A1A1A', hair: 'long'     },
  { id: 'long-layers',    label: 'Long Layers',       color: '#7B4F2E', hair: 'long'     },
  { id: 'curtain-bangs',  label: 'Curtain Bangs',     color: '#C08050', hair: 'long'     },
  { id: 'side-part-long', label: 'Side Part Long',    color: '#4A3020', hair: 'long'     },
  { id: 'curly-natural',  label: 'Natural Curls',     color: '#3D2B1F', hair: 'curly'    },
  { id: 'curly-bob',      label: 'Curly Bob',         color: '#8B5E3C', hair: 'curly'    },
  { id: 'perm-waves',     label: 'Perm Waves',        color: '#B07840', hair: 'wavy'     },
  { id: 'blunt-straight', label: 'Blunt Cut',         color: '#2A1A0E', hair: 'medium'   },
  { id: 'middle-part',    label: 'Middle Part',       color: '#6B4226', hair: 'long'     },
  { id: 'beach-waves',    label: 'Beach Waves',       color: '#C8A060', hair: 'wavy'     },
  { id: 'mermaid-waves',  label: 'Mermaid Waves',     color: '#8B2252', hair: 'long'     },
]

function buildSVG(h) {
  const hairColor = h.color

  const hairPaths = {
    short: `
      <ellipse cx="150" cy="100" rx="70" ry="80" fill="${hairColor}"/>
      <rect x="80" y="110" width="140" height="30" rx="4" fill="${hairColor}"/>`,
    bob: `
      <ellipse cx="150" cy="95" rx="70" ry="80" fill="${hairColor}"/>
      <rect x="82" y="130" width="136" height="50" rx="4" fill="${hairColor}"/>`,
    'bob-wavy': `
      <ellipse cx="150" cy="95" rx="70" ry="80" fill="${hairColor}"/>
      <path d="M82 140 Q100 160 118 140 Q136 120 154 140 Q172 160 190 140 Q208 120 218 140 L218 180 Q150 200 82 180 Z" fill="${hairColor}"/>`,
    medium: `
      <ellipse cx="150" cy="90" rx="72" ry="82" fill="${hairColor}"/>
      <path d="M80 140 Q80 200 88 220 L88 250 Q120 260 150 260 Q180 260 212 250 L212 220 Q220 200 220 140Z" fill="${hairColor}"/>`,
    'med-wavy': `
      <ellipse cx="150" cy="90" rx="72" ry="82" fill="${hairColor}"/>
      <path d="M80 140 Q85 175 80 200 Q90 230 90 250 Q120 260 150 260 Q180 260 210 250 Q210 230 220 200 Q215 175 220 140Z" fill="${hairColor}"/>`,
    long: `
      <ellipse cx="150" cy="88" rx="72" ry="82" fill="${hairColor}"/>
      <path d="M78 140 L75 300 Q100 340 150 340 Q200 340 225 300 L222 140Z" fill="${hairColor}"/>`,
    curly: `
      <ellipse cx="150" cy="90" rx="78" ry="88" fill="${hairColor}"/>
      <circle cx="88"  cy="145" r="22" fill="${hairColor}"/>
      <circle cx="212" cy="145" r="22" fill="${hairColor}"/>
      <circle cx="100" cy="175" r="20" fill="${hairColor}"/>
      <circle cx="200" cy="175" r="20" fill="${hairColor}"/>
      <circle cx="115" cy="200" r="18" fill="${hairColor}"/>
      <circle cx="185" cy="200" r="18" fill="${hairColor}"/>`,
    wavy: `
      <ellipse cx="150" cy="88" rx="72" ry="82" fill="${hairColor}"/>
      <path d="M78 138 Q78 170 75 200 Q78 230 78 260 Q110 300 150 310 Q190 300 222 260 Q222 230 225 200 Q222 170 222 138Z" fill="${hairColor}"/>`,
  }

  const hair = hairPaths[h.hair] || hairPaths['medium']

  return `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
  <rect width="300" height="400" fill="#F0EDE8"/>
  <ellipse cx="150" cy="420" rx="110" ry="65" fill="#E8D5C4"/>
  <rect x="130" y="245" width="40" height="48" rx="8" fill="#F5C5A3"/>
  <ellipse cx="150" cy="195" rx="58" ry="68" fill="#F5C5A3"/>
  ${hair}
  <ellipse cx="128" cy="190" rx="8" ry="6" fill="#fff"/>
  <ellipse cx="172" cy="190" rx="8" ry="6" fill="#fff"/>
  <circle cx="130" cy="191" r="4" fill="#3D2B1F"/>
  <circle cx="174" cy="191" r="4" fill="#3D2B1F"/>
  <circle cx="131" cy="189" r="1.5" fill="#fff"/>
  <circle cx="175" cy="189" r="1.5" fill="#fff"/>
  <path d="M119 180 Q128 175 137 180" stroke="#5C3D20" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M163 180 Q172 175 181 180" stroke="#5C3D20" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M148 200 Q143 214 148 218 Q155 218 152 214 Z" fill="none" stroke="#C4956A" stroke-width="1.5"/>
  <path d="M136 232 Q150 226 164 232" stroke="#C07050" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M136 232 Q150 240 164 232" fill="#D4826A"/>
  <rect x="0" y="360" width="300" height="40" fill="rgba(10,10,10,0.8)"/>
  <text x="150" y="385" font-family="sans-serif" font-size="13" font-weight="bold" fill="#F5A623" text-anchor="middle">${h.label}</text>
</svg>`
}

const outDir = path.join(__dirname, '..', 'public', 'hairstyles')
fs.mkdirSync(outDir, { recursive: true })

hairstyles.forEach(h => {
  const svg = buildSVG(h)
  // Save as SVG but named .jpg so Next.js Image serves them correctly
  fs.writeFileSync(path.join(outDir, `${h.id}.jpg`), svg)
  console.log(`✓ ${h.id}.jpg`)
})

console.log(`\nDone — ${hairstyles.length} placeholder images created.`)
