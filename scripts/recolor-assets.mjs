import sharp from 'sharp';
import { mkdir } from 'fs/promises';

const SRC = 'scripts/master-polo-mockup.jpg';
const OUT = 'public/products';
await mkdir(OUT, { recursive: true });

// Full-res bounding boxes [x0,x1,y0,y1] detected from analysis
const VIEWS = {
  side:  { box: [836, 2192, 396, 3380] },
  front: { box: [2416, 5020, 386, 3372] },
  back:  { box: [5194, 7828, 378, 3382] },
};

// Working height for the shirt (px). All shirts scaled to this height -> consistent size.
const SHIRT_H = 1180;
const CANVAS_W = 1200;
const CANVAS_H = 1400;

// --- color palette: mid = lit fabric body color ---
const hx = (h) => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
const mix = (a, b, t) => a.map((v,i)=>Math.round(v+(b[i]-v)*t));
const WHITE=[255,255,255], BLACK=[0,0,0];

const COLORS = {
  black:   '#141414',
  white:   '#f1f1ef',
  navy:    '#202c46',
  charcoal:'#3a3d42',
  olive:   '#56532f',
  forest:  '#26432f',
  beige:   '#c7b596',
  cream:   '#ece2cd',
  maroon:  '#5d2330',
  brown:   '#5b4133',
  slate:   '#616d79',
};

// duotone shade ramp from a normalized luminance n(0..1) of the original shirt
function makeRamp(midHex) {
  const mid = hx(midHex);
  const lum = 0.299*mid[0]+0.587*mid[1]+0.114*mid[2];
  const sheenT = 0.26 + Math.min(0.20, lum/255 * 0.22); // darker fabric -> less sheen
  const shadow = mix(mid, BLACK, 0.52);
  const sheen  = mix(mid, WHITE, sheenT);
  // normalize: shirt luminance lives ~0.52..1.0
  const LO = 0.50, HI = 1.0, KNEE = 0.70;
  return (n) => {
    let t = (n - LO) / (HI - LO);
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    if (t < KNEE) { const k = t / KNEE; return mix(shadow, mid, k); }
    const k = (t - KNEE) / (1 - KNEE); return mix(mid, sheen, k);
  };
}

function logoColor(midHex) {
  const mid = hx(midHex);
  const lum = 0.299*mid[0]+0.587*mid[1]+0.114*mid[2];
  // tone-on-tone embroidery: lighter thread on dark shirts, darker thread on light shirts
  const target = lum < 110 ? mix(mid, WHITE, 0.55) : mix(mid, BLACK, 0.42);
  return `rgb(${target[0]},${target[1]},${target[2]})`;
}

function logoSvg(midHex, w, h) {
  const col = logoColor(midHex);
  const fs = Math.round(h * 0.62);
  return Buffer.from(
    `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
       <text x="50%" y="50%" dy="0.34em" text-anchor="middle"
         font-family="Georgia, 'Times New Roman', serif" font-size="${fs}"
         font-weight="600" letter-spacing="${fs*0.10}" fill="${col}"
         fill-opacity="0.92">KVAI</text>
     </svg>`);
}

// border flood fill: mark background-connected transparent pixels; the rest of the
// transparent pixels are interior holes -> make them opaque (part of shirt).
function fillHoles(alpha, W, H) {
  const bg = new Uint8Array(W * H); // 1 = reachable background
  const stack = [];
  const push = (x, y) => { if (x>=0&&x<W&&y>=0&&y<H){const i=y*W+x; if(!bg[i]&&alpha[i]<20){bg[i]=1;stack.push(i);}} };
  for (let x=0;x<W;x++){ push(x,0); push(x,H-1); }
  for (let y=0;y<H;y++){ push(0,y); push(W-1,y); }
  while (stack.length){ const i=stack.pop(); const x=i%W, y=(i/W)|0; push(x+1,y);push(x-1,y);push(x,y+1);push(x,y-1); }
  for (let i=0;i<W*H;i++){ if(alpha[i]<255 && !bg[i]) alpha[i]=255; } // interior hole -> opaque
}

async function processView(viewName, box) {
  const [x0,x1,y0,y1] = box;
  const pad = 30;
  const cx0=Math.max(0,x0-pad), cy0=Math.max(0,y0-pad);
  const cw=(x1-x0)+pad*2, chh=(y1-y0)+pad*2;
  // crop then scale so shirt height -> SHIRT_H
  const scale = SHIRT_H / (y1 - y0);
  const W = Math.round(cw * scale), H = Math.round(chh * scale);
  const { data } = await sharp(SRC)
    .extract({ left: cx0, top: cy0, width: cw, height: chh })
    .resize(W, H).removeAlpha().raw().toBuffer({ resolveWithObject: true });

  // luminance + alpha mask
  const N = W * H;
  const lum = new Float32Array(N);
  const alpha = new Uint8Array(N);
  for (let i=0;i<N;i++){
    const r=data[i*3], g=data[i*3+1], b=data[i*3+2];
    const L = 0.299*r+0.587*g+0.114*b;
    lum[i]=L;
    // smoothstep 135..172
    let a=(L-135)/(172-135); a=a<0?0:a>1?1:a; a=a*a*(3-2*a);
    alpha[i]=Math.round(a*255);
  }
  fillHoles(alpha, W, H);

  // normalized luminance for recolor (use original L)
  const nrm = new Float32Array(N);
  for (let i=0;i<N;i++) nrm[i] = lum[i]/255;

  for (const [name, hex] of Object.entries(COLORS)) {
    const ramp = makeRamp(hex);
    const out = Buffer.alloc(N * 4);
    for (let i=0;i<N;i++){
      const a = alpha[i];
      if (a === 0) { continue; } // transparent
      const c = ramp(nrm[i]);
      out[i*4]=c[0]; out[i*4+1]=c[1]; out[i*4+2]=c[2]; out[i*4+3]=a;
    }
    let shirt = sharp(out, { raw: { width: W, height: H, channels: 4 } });

    // logo only on front view (left chest = viewer's right side)
    if (viewName === 'front') {
      const lw = Math.round(W * 0.155), lh = Math.round(lw * 0.34);
      const lx = Math.round(W * 0.585);
      const ly = Math.round(H * 0.345);
      shirt = sharp(out, { raw: { width: W, height: H, channels: 4 } })
        .composite([{ input: logoSvg(hex, lw, lh), left: lx, top: ly }]);
    }
    const shirtPng = await shirt.png().toBuffer();

    // center on uniform transparent canvas
    await sharp({ create: { width: CANVAS_W, height: CANVAS_H, channels: 4, background: { r:0,g:0,b:0,alpha:0 } } })
      .composite([{ input: shirtPng, gravity: 'center' }])
      .png({ compressionLevel: 9 })
      .toFile(`${OUT}/${name}-${viewName}.png`);
  }
  console.log(`done ${viewName} (${W}x${H})`);
}

for (const [v, cfg] of Object.entries(VIEWS)) {
  await processView(v, cfg.box);
}
console.log('ALL DONE');
