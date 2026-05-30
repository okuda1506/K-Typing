import { C, addBg, box, footer, text } from './_shared.mjs';

export async function slide01(presentation, ctx) {
  const slide = presentation.slides.add();
  addBg(slide, ctx, 1);
  text(slide, ctx, 'K-Typing Backend', 78, 62, 420, 24, {
    size: 13,
    bold: true,
    color: C.muted,
    typeface: 'Aptos',
  });
  text(slide, ctx, 'NestJS 設計思想と\nコーディング規約', 78, 132, 860, 164, {
    size: 54,
    bold: true,
    color: C.ink,
  });
  text(slide, ctx, 'REST API版 / 初学者が迷わないための実装ルール', 82, 312, 640, 34, {
    size: 20,
    color: C.muted,
  });
  box(slide, ctx, 80, 422, 340, 110, C.paper, C.line);
  text(slide, ctx, '守ること', 106, 442, 120, 24, { size: 16, bold: true });
  text(slide, ctx, 'Moduleで境界を切り、Controllerは薄く、Serviceに業務処理を寄せる', 106, 474, 270, 36, {
    size: 14,
    color: C.muted,
  });
  box(slide, ctx, 456, 422, 340, 110, C.paper, C.line);
  text(slide, ctx, '捨てること', 482, 442, 120, 24, { size: 16, bold: true });
  text(slide, ctx, 'AppModule肥大化、Controller内ビジネスロジック、newによる依存生成', 482, 474, 270, 36, {
    size: 14,
    color: C.muted,
  });
  text(slide, ctx, '2026.05', 1080, 584, 120, 28, { size: 18, color: C.quiet, align: 'right' });
  footer(slide, ctx);
  return slide;
}
