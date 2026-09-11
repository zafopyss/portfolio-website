import * as THREE from 'three';

// Fake code editor shown on the laptop screen. Types a snippet, rests, clears.
const SNIPPET = [
  '# permits/services.py',
  'from dataclasses import dataclass',
  'from .models import Permit, Template',
  '',
  '@dataclass',
  'class PermitDraft:',
  '    template: Template',
  '    site: str',
  '',
  'def create_permit(draft: PermitDraft) -> Permit:',
  '    permit = Permit.objects.create(',
  '        template=draft.template,',
  '        site=draft.site,',
  '        status="draft",',
  '    )',
  '    permit.render_sections()',
  '    return permit',
];

const CHARS_PER_SECOND = 16;
const REST_SECONDS = 5;
const TOTAL_CHARS = SNIPPET.reduce((n, line) => n + line.length + 1, 0);
const CYCLE = TOTAL_CHARS / CHARS_PER_SECOND + REST_SECONDS;

const COLORS = {
  bg: '#1c1f2a',
  gutter: '#3a3f52',
  text: '#d6dae6',
  keyword: '#c792ea',
  string: '#a5d68a',
  comment: '#6c7189',
  decorator: '#e9c46a',
  type: '#82aaff',
};

const TOKEN = /(#.*$)|("[^"]*")|(@\w+)|\b(from|import|class|def|return)\b|\b([A-Z]\w+)\b/g;

function paintLine(ctx: CanvasRenderingContext2D, line: string, x: number, y: number) {
  let last = 0;
  for (const match of line.matchAll(TOKEN)) {
    const start = match.index ?? 0;
    if (start > last) {
      ctx.fillStyle = COLORS.text;
      ctx.fillText(line.slice(last, start), x + ctx.measureText(line.slice(0, last)).width, y);
    }
    const [, comment, string, decorator, keyword, type] = match;
    ctx.fillStyle = comment ? COLORS.comment : string ? COLORS.string : decorator ? COLORS.decorator : keyword ? COLORS.keyword : type ? COLORS.type : COLORS.text;
    ctx.fillText(match[0], x + ctx.measureText(line.slice(0, start)).width, y);
    last = start + match[0].length;
  }
  if (last < line.length) {
    ctx.fillStyle = COLORS.text;
    ctx.fillText(line.slice(last), x + ctx.measureText(line.slice(0, last)).width, y);
  }
}

export function createEditor(width = 232, height = 176) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('2d context unavailable');
  const ctx: CanvasRenderingContext2D = context;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  let shownChars = -1;
  let cursorOn = true;

  function draw(chars: number, cursor: boolean) {
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#262a38';
    ctx.fillRect(0, 0, width, 16);
    for (const [i, color] of ['#ff5f57', '#febc2e', '#28c840'].entries()) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(10 + i * 11, 8, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.font = 'bold 9.5px ui-monospace, Menlo, Consolas, monospace';
    ctx.textBaseline = 'top';
    let remaining = chars;
    let y = 22;
    for (const [index, line] of SNIPPET.entries()) {
      if (remaining < 0) break;
      const visible = line.slice(0, Math.max(0, Math.min(line.length, remaining)));
      ctx.fillStyle = COLORS.gutter;
      ctx.fillText(String(index + 1).padStart(2, ' '), 4, y);
      paintLine(ctx, visible, 20, y);
      const lineDone = remaining > line.length;
      if (!lineDone && cursor) {
        ctx.fillStyle = COLORS.text;
        ctx.fillRect(20 + ctx.measureText(visible).width + 1, y - 1, 5, 11);
      }
      remaining -= line.length + 1;
      y += 11;
    }
    texture.needsUpdate = true;
  }

  return {
    texture,
    update(seconds: number) {
      const t = seconds % CYCLE;
      const chars = Math.min(TOTAL_CHARS, Math.floor(t * CHARS_PER_SECOND));
      const cursor = Math.floor(seconds * 2) % 2 === 0;
      if (chars !== shownChars || cursor !== cursorOn) {
        shownChars = chars;
        cursorOn = cursor;
        draw(chars, cursor);
      }
    },
  };
}
