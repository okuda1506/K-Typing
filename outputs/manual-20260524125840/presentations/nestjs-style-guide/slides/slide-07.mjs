import { C, addBg, code, footer, ruleCard, title } from './_shared.mjs';

export async function slide07(presentation, ctx) {
  const slide = presentation.slides.add();
  addBg(slide, ctx, 7);
  title(slide, ctx, 'FEATURE MODULES', 'AppModuleに直接生やさない', 'Root Moduleはアプリ全体を組み立てる場所、機能実装を書く場所ではない');
  code(slide, ctx,
`src/
  app.module.ts
  prisma/
    prisma.module.ts
    prisma.service.ts
  auth/
    auth.module.ts
    auth.controller.ts
    auth.service.ts
    dto/
      sign-up.dto.ts
      sign-in.dto.ts
  users/
    users.module.ts
    users.controller.ts
    users.service.ts
    dto/
      update-profile.dto.ts`, 80, 252, 520, 330, { size: 12 });
  ruleCard(slide, ctx, '鉄則', 'app.module.tsにはimportsだけを増やす\n機能クラスを直接並べない', 680, 252, 440, 112, C.ink);
  ruleCard(slide, ctx, '理由', '機能境界が崩れると、依存関係の見通しが消える\nテスト単位も曖昧になる', 680, 392, 440, 112, C.red);
  ruleCard(slide, ctx, 'Laravel比較', 'routes/web.phpに全部書かないのと同じ\nNestではModuleが整理棚', 680, 532, 440, 100, C.blue);
  footer(slide, ctx);
  return slide;
}
