import { C, addBg, footer, text, title } from './_shared.mjs';

export async function slide03(presentation, ctx) {
  const slide = presentation.slides.add();
  addBg(slide, ctx, 3);
  title(slide, ctx, 'THREE BUILDING BLOCKS', 'Module / Controller / Service を混ぜない', 'Nestの基本単位は、役割分担を強制するために使う');
  const items = [
    ['Module', '構造の定義\nカプセル化の境界', 'imports / controllers / providers / exports を宣言'],
    ['Controller', 'HTTPの入口\nREST endpoint', 'Body / Param / Query を受け、Serviceへ渡す'],
    ['Service', '業務処理\nデータ層との連携', 'Prisma操作、判定、集計、外部API連携を実行'],
  ];
  items.forEach(([name, role, body], i) => {
    const x = 98 + i * 390;
    ctx.addShape(slide, { x, y: 260, width: 300, height: 300, fill: C.paper, line: { fill: C.line, width: 1, style: 'solid' } });
    text(slide, ctx, name, x + 28, 288, 240, 34, { size: 27, bold: true, typeface: 'Aptos' });
    text(slide, ctx, role, x + 28, 350, 230, 78, { size: 25, bold: true, color: i === 0 ? C.blue : i === 1 ? C.green : C.ink });
    text(slide, ctx, body, x + 28, 462, 232, 70, { size: 15, color: C.muted });
  });
  text(slide, ctx, 'Controllerに処理を集めると、テスト不能・再利用不能・肥大化の3点セットになる', 126, 590, 980, 28, {
    size: 20,
    bold: true,
    color: C.ink,
    align: 'center',
  });
  footer(slide, ctx);
  return slide;
}
