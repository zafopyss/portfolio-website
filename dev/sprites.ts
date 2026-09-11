// Dev bench: `npm run dev` then open /dev/sprites.html to see every painted
// sprite at 4x over a patch of the backdrop.
import * as paint from '../src/scene/paint';
import * as plants from '../src/scene/plants';

const ZOOM = 4;
const bench: Record<string, () => paint.Sprite> = {
  pot: () => paint.pot(),
  coffeeCup: () => paint.coffeeCup(),
  shadow: () => paint.shadow(),
  passionflower: () => paint.passionflower(),
  vine: () => paint.vine(),
  nasturtium: () => plants.nasturtium(),
  bed: () => plants.bed(11),
};

for (const [name, make] of Object.entries(bench)) {
  const sprite = make();
  const source = sprite.texture.image as HTMLCanvasElement;
  const figure = document.createElement('figure');
  const canvas = document.createElement('canvas');
  canvas.width = sprite.width * ZOOM;
  canvas.height = sprite.height * ZOOM;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  const caption = document.createElement('figcaption');
  caption.textContent = `${name} ${sprite.width}×${sprite.height}`;
  figure.append(canvas, caption);
  document.body.append(figure);
}
