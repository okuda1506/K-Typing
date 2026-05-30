import { C, addBg, bulletList, footer, ruleCard, title } from './_shared.mjs';

export async function slide02(presentation, ctx) {
  const slide = presentation.slides.add();
  addBg(slide, ctx, 2);
  title(slide, ctx, 'CORE PHILOSOPHY', 'NestJSは構造で保守性を作る', '公式思想をK-Typingの開発ルールへ落とし込む');
  ruleCard(slide, ctx, '拡張性', '機能が増えても、Feature Moduleを追加するだけで構造を保つ\n認証、レッスン、タイピング、AI生成を別境界にする', 80, 250, 340, 158, C.blue);
  ruleCard(slide, ctx, '疎結合', 'ControllerはServiceへ委譲し、依存はDIで渡す\n呼び出し元は具象生成を知らない', 470, 250, 340, 158, C.green);
  ruleCard(slide, ctx, '保守性', 'DTO、Service、Moduleの責務を固定する\n変更箇所が予測できる状態を作る', 860, 250, 340, 158, C.ink);
  bulletList(slide, ctx, [
    '一貫性のないNestコードは、LaravelでControllerに全部書く状態と同じ',
    'アーキテクチャを先に固定すると、初心者でも迷う範囲が狭くなる',
    'K-Typingでは「REST Controller + Service + Prisma」を標準形にする',
  ], 92, 462, 1060, { size: 18, gap: 42, dot: C.blue });
  footer(slide, ctx);
  return slide;
}
