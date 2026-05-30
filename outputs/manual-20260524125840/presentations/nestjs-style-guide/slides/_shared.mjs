export const C = {
  bg: '#f3f4f5',
  paper: '#ffffff',
  ink: '#24211f',
  soft: '#302d2a',
  muted: '#687078',
  quiet: '#a2a9af',
  line: '#dde1e4',
  green: '#20b26b',
  red: '#d6453d',
  blue: '#49606f',
};

export function addBg(slide, ctx, n) {
  ctx.addShape(slide, { x: 0, y: 0, width: ctx.W, height: ctx.H, fill: C.bg });
  ctx.addText(slide, {
    text: String(n).padStart(2, '0'),
    x: 1130,
    y: 642,
    width: 72,
    height: 24,
    size: 13,
    color: C.quiet,
    align: 'right',
    valign: 'middle',
  });
}

export function title(slide, ctx, kicker, main, sub) {
  ctx.addText(slide, {
    text: kicker,
    x: 78,
    y: 50,
    width: 260,
    height: 22,
    size: 12,
    bold: true,
    color: C.muted,
    typeface: 'Aptos',
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
  ctx.addText(slide, {
    text: main,
    x: 78,
    y: 86,
    width: 950,
    height: 58,
    size: 38,
    bold: true,
    color: C.ink,
    typeface: 'Hiragino Sans',
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
  if (sub) {
    ctx.addText(slide, {
      text: sub,
      x: 80,
      y: 154,
      width: 880,
      height: 48,
      size: 18,
      color: C.muted,
      typeface: 'Hiragino Sans',
      insets: { left: 0, right: 0, top: 0, bottom: 0 },
    });
  }
  ctx.addShape(slide, { x: 78, y: 205, width: 1120, height: 1, fill: C.line });
}

export function footer(slide, ctx, text = 'K-Typing Backend Style Guide') {
  ctx.addText(slide, {
    text,
    x: 78,
    y: 642,
    width: 520,
    height: 22,
    size: 11,
    color: C.quiet,
    typeface: 'Aptos',
  });
}

export function box(slide, ctx, x, y, w, h, fill = C.paper, line = C.line) {
  return ctx.addShape(slide, {
    x,
    y,
    width: w,
    height: h,
    fill,
    line: { fill: line, width: 1, style: 'solid' },
  });
}

export function text(slide, ctx, value, x, y, w, h, opt = {}) {
  return ctx.addText(slide, {
    text: value,
    x,
    y,
    width: w,
    height: h,
    size: opt.size ?? 18,
    bold: opt.bold ?? false,
    color: opt.color ?? C.ink,
    typeface: opt.typeface ?? 'Hiragino Sans',
    align: opt.align ?? 'left',
    valign: opt.valign ?? 'top',
    fill: opt.fill ?? '#00000000',
    line: opt.line ?? { fill: '#00000000', width: 0, style: 'solid' },
    insets: opt.insets ?? { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

export function bulletList(slide, ctx, items, x, y, w, opt = {}) {
  const gap = opt.gap ?? 48;
  items.forEach((item, index) => {
    const top = y + index * gap;
    ctx.addShape(slide, {
      x,
      y: top + 7,
      width: 7,
      height: 7,
      fill: opt.dot ?? C.ink,
      geometry: 'ellipse',
      line: { fill: '#00000000', width: 0, style: 'solid' },
    });
    text(slide, ctx, item, x + 22, top, w - 22, gap - 4, {
      size: opt.size ?? 18,
      color: opt.color ?? C.ink,
    });
  });
}

export function tag(slide, ctx, label, x, y, color = C.ink) {
  box(slide, ctx, x, y, 92, 28, color, color);
  text(slide, ctx, label, x, y + 4, 92, 20, {
    size: 12,
    bold: true,
    color: C.paper,
    align: 'center',
    typeface: 'Aptos',
  });
}

export function code(slide, ctx, source, x, y, w, h, opt = {}) {
  box(slide, ctx, x, y, w, h, opt.fill ?? '#1f1f1f', opt.line ?? '#1f1f1f');
  text(slide, ctx, source, x + 18, y + 16, w - 36, h - 28, {
    size: opt.size ?? 14,
    color: opt.color ?? '#f8f9fa',
    typeface: 'Menlo',
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

export function doDont(slide, ctx, doText, dontText, y = 250) {
  tag(slide, ctx, 'DO', 80, y, C.green);
  code(slide, ctx, doText, 80, y + 40, 520, 260, { size: 12 });
  tag(slide, ctx, "DON'T", 680, y, C.red);
  code(slide, ctx, dontText, 680, y + 40, 520, 260, { size: 12 });
}

export function ruleCard(slide, ctx, label, body, x, y, w, h, accent = C.ink) {
  box(slide, ctx, x, y, w, h, C.paper, C.line);
  ctx.addShape(slide, { x, y, width: 5, height: h, fill: accent });
  text(slide, ctx, label, x + 22, y + 18, w - 44, 26, {
    size: 18,
    bold: true,
    color: C.ink,
  });
  text(slide, ctx, body, x + 22, y + 52, w - 44, h - 58, {
    size: 15,
    color: C.muted,
  });
}
