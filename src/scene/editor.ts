import * as THREE from 'three';

// Fake code editor shown on the laptop screen. Types a snippet, rests, clears.
const SNIPPET = [
  '# permits/services.py',
  'from .models import Permit',
  '',
  'def create_permit(draft: Draft) -> Permit:',
  '    permit = Permit.objects.create(',
  '        template=draft.template,',
  '        site=draft.site,',
  '        status="draft",',
  '    )',
  '    permit.render_sections()',
  '    return permit',
];

const CHARS_PER_SECOND = 14;
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

// The screen quad is about 100 by 80 artwork pixels; the canvas is drawn at
// 2.4x so the text stays crisp on retina screens. Bezel edges are feathered so
// the quad blends into the painted frame instead of cutting a hard aliased line.
const LINE_HEIGHT = 14;
const TOP = 26;
const EDGE_FADE = 3;

export function createEditor(width = 240, height = 194) {
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
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#262a38';
    ctx.fillRect(0, 0, width, 18);
    for (const [i, color] of ['#ff5f57', '#febc2e', '#28c840'].entries()) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(11 + i * 12, 9, 3.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.font = 'bold 11px ui-monospace, Menlo, Consolas, monospace';
    ctx.textBaseline = 'top';
    let remaining = chars;
    let y = TOP;
    for (const [index, line] of SNIPPET.entries()) {
      if (remaining < 0) break;
      const visible = line.slice(0, Math.max(0, Math.min(line.length, remaining)));
      ctx.fillStyle = COLORS.gutter;
      ctx.fillText(String(index + 1).padStart(2, ' '), 5, y);
      paintLine(ctx, visible, 24, y);
      const lineDone = remaining > line.length;
      if (!lineDone && cursor) {
        ctx.fillStyle = COLORS.text;
        ctx.fillRect(24 + ctx.measureText(visible).width + 1, y - 1, 6, 13);
      }
      remaining -= line.length + 1;
      y += LINE_HEIGHT;
    }
    feather();
    texture.needsUpdate = true;
  }

  // Fade the outermost pixels to transparent on all four sides. destination-out
  // only erases under the drawn strip; destination-in would wipe the rest.
  function feather() {
    ctx.globalCompositeOperation = 'destination-out';
    const strips: [number, number, number, number][] = [
      [0, 0, 0, EDGE_FADE],
      [0, height, 0, height - EDGE_FADE],
      [0, 0, EDGE_FADE, 0],
      [width, 0, width - EDGE_FADE, 0],
    ];
    for (const [x0, y0, x1, y1] of strips) {
      const fade = ctx.createLinearGradient(x0, y0, x1, y1);
      fade.addColorStop(0, 'rgba(0,0,0,1)');
      fade.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = fade;
      const vertical = x0 === x1;
      ctx.fillRect(
        vertical ? 0 : Math.min(x0, x1),
        vertical ? Math.min(y0, y1) : 0,
        vertical ? width : EDGE_FADE,
        vertical ? EDGE_FADE : height,
      );
    }
    ctx.globalCompositeOperation = 'source-over';
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
