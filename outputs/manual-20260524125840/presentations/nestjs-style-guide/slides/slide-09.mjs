import { addBg, doDont, footer, title } from './_shared.mjs';

export async function slide09(presentation, ctx) {
  const slide = presentation.slides.add();
  addBg(slide, ctx, 9);
  title(slide, ctx, 'GLOBAL MODULES', '@Global()は原則禁止', '明示的なimportsを崩すと、依存関係が見えなくなる');
  doDont(
    slide,
    ctx,
`@Module({
  imports: [PrismaModule],
  providers: [TypingSessionsService],
})
export class TypingModule {}

// 依存元がファイル上で読める`,
`@Global()
@Module({
  providers: [PrismaService, ConfigService],
  exports: [PrismaService, ConfigService],
})
export class SharedModule {}

// どのModuleが何に依存するか見えない`,
  );
  footer(slide, ctx);
  return slide;
}
