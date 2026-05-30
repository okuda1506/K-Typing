import { C, addBg, code, footer, text, title } from './_shared.mjs';

export async function slide08(presentation, ctx) {
  const slide = presentation.slides.add();
  addBg(slide, ctx, 8);
  title(slide, ctx, 'SHARED MODULES', '共有は exports と imports で明示する', 'NestのModule/Providerはデフォルトでシングルトン、共有方法を間違えると別インスタンス化する');
  code(slide, ctx,
`@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

@Module({
  imports: [PrismaModule],
  providers: [UsersService],
})
export class UsersModule {}`, 80, 256, 520, 276, { size: 14 });
  text(slide, ctx, '正しい共有', 680, 258, 360, 34, { size: 26, bold: true, color: C.green });
  text(slide, ctx, '使いたいServiceを定義元Moduleでexportsし、利用側Moduleでimportsする\nこれで同じProviderインスタンスを安全に共有できる', 680, 306, 450, 94, {
    size: 18,
    color: C.ink,
  });
  text(slide, ctx, '禁止', 680, 444, 360, 34, { size: 26, bold: true, color: C.red });
  text(slide, ctx, '必要なModuleごとに同じServiceをprovidersへ再登録しない\n状態不整合、余計なメモリ、DIエラーの原因になる', 680, 492, 450, 94, {
    size: 18,
    color: C.ink,
  });
  footer(slide, ctx);
  return slide;
}
