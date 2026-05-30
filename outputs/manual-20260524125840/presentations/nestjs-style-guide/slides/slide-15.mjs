import { C, addBg, footer, text, title } from './_shared.mjs';

export async function slide15(presentation, ctx) {
  const slide = presentation.slides.add();
  addBg(slide, ctx, 15);
  title(slide, ctx, 'SOURCES', '参照したNestJS公式ドキュメント', '設計ルールの根拠、実装時に迷ったら公式の該当章へ戻る');
  const sources = [
    ['Modules', 'https://docs.nestjs.com/modules', 'Feature module、shared module、exports/imports、global moduleの考え方'],
    ['Controllers', 'https://docs.nestjs.com/controllers', 'HTTP method decorator、ControllerはModuleに所属すること、CLI generator'],
    ['Providers', 'https://docs.nestjs.com/components', 'Provider、Service、DI、constructor injection、manual instantiation'],
    ['Validation', 'https://docs.nestjs.com/techniques/validation', 'DTO、ValidationPipe、class-validator、whitelist/transform'],
    ['Injection scopes', 'https://docs.nestjs.com/fundamentals/injection-scopes', 'Provider/Controllerのライフタイムとscopeの注意点'],
  ];
  sources.forEach(([label, url, memo], i) => {
    const y = 250 + i * 66;
    text(slide, ctx, label, 98, y, 180, 26, { size: 20, bold: true, typeface: 'Aptos' });
    text(slide, ctx, url, 300, y, 520, 22, { size: 13, color: C.blue, typeface: 'Aptos' });
    text(slide, ctx, memo, 300, y + 24, 780, 24, { size: 14, color: C.muted });
  });
  footer(slide, ctx);
  return slide;
}
