const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'components');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const replacements = [
  // Backgrounds
  { regex: /bg-white/g, replacement: 'bg-[var(--color-wusha-ivory)]' },
  { regex: /bg-\[#fcfbf7\]/g, replacement: 'bg-[var(--color-wusha-ivory)]' },
  { regex: /bg-\[#fcfbf9\]/g, replacement: 'bg-[var(--color-wusha-ivory)]' },
  { regex: /bg-\[#efede6\]/g, replacement: 'bg-[var(--color-wusha-cotton)]' },
  { regex: /bg-slate-900/g, replacement: 'bg-[var(--color-wusha-ink)]' },
  { regex: /hover:bg-slate-800/g, replacement: 'hover:bg-[#3a2828]' },
  { regex: /bg-slate-50\/50/g, replacement: 'bg-[var(--color-wusha-cotton)]' },
  { regex: /bg-slate-50/g, replacement: 'bg-[var(--color-wusha-cotton)]' },
  { regex: /bg-slate-100/g, replacement: 'bg-[var(--color-wusha-cotton)]' },
  { regex: /bg-\[#E8E4DF\]/g, replacement: 'bg-[var(--color-wusha-cotton)]' },
  { regex: /bg-\[#EFECE7\]/g, replacement: 'bg-[var(--color-wusha-cotton)]' },

  // Borders
  { regex: /border-\[#e8e6df\]/g, replacement: 'border-[var(--color-wusha-cotton)]' },
  { regex: /border-\[#dfddd5\]/g, replacement: 'border-[var(--color-wusha-pale-gold)]' },
  { regex: /border-\[#eef0eb\]/g, replacement: 'border-[var(--color-wusha-cotton)]' },
  { regex: /border-\[#e8e7e3\]/g, replacement: 'border-[var(--color-wusha-cotton)]' },
  { regex: /border-\[#e1dfda\]/g, replacement: 'border-[var(--color-wusha-pale-gold)]' },
  { regex: /border-\[#e2dfd7\]/g, replacement: 'border-[var(--color-wusha-pale-gold)]' },
  { regex: /border-slate-100/g, replacement: 'border-[var(--color-wusha-cotton)]' },
  { regex: /border-\[#E2DDD6\]/g, replacement: 'border-[var(--color-wusha-pale-gold)]' },

  // Text
  { regex: /text-slate-800/g, replacement: 'text-[var(--color-wusha-ink)]' },
  { regex: /text-slate-700/g, replacement: 'text-[var(--color-wusha-ink)]' },
  { regex: /text-slate-900/g, replacement: 'text-[var(--color-wusha-ink)]' },
  { regex: /text-slate-600/g, replacement: 'text-[var(--color-wusha-stone)]' },
  { regex: /text-slate-500/g, replacement: 'text-[var(--color-wusha-stone)]' },
  { regex: /text-slate-400/g, replacement: 'text-[var(--color-wusha-stone)]' },
  { regex: /text-\[#2D2926\]/g, replacement: 'text-[var(--color-wusha-ink)]' },
  { regex: /text-\[#8C7D6B\]/g, replacement: 'text-[var(--color-wusha-stone)]' },
  { regex: /text-\[#5A524A\]/g, replacement: 'text-[var(--color-wusha-stone)]' },

  // Primary buttons (Amber -> Muted Gold)
  { regex: /bg-amber-500/g, replacement: 'bg-[var(--color-wusha-muted-gold)]' },
  { regex: /hover:bg-amber-600/g, replacement: 'hover:bg-[#b0946a]' },
  { regex: /text-amber-900/g, replacement: 'text-[var(--color-wusha-ink)]' },

  // Radii
  // Change rounded-xl (12px) to rounded-2xl (16px) or rounded-lg (8px)
  { regex: /rounded-xl/g, replacement: 'rounded-2xl' }
];

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});

// Also update page.tsx
const pagePath = path.join(__dirname, 'app', 'page.tsx');
if (fs.existsSync(pagePath)) {
    let pageContent = fs.readFileSync(pagePath, 'utf8');
    let pageOriginal = pageContent;
    replacements.forEach(({ regex, replacement }) => {
      pageContent = pageContent.replace(regex, replacement);
    });
    if (pageContent !== pageOriginal) {
      fs.writeFileSync(pagePath, pageContent, 'utf8');
      console.log(`Updated page.tsx`);
    }
}
