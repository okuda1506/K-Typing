import { addBg, doDont, footer, title } from './_shared.mjs';

export async function slide04(presentation, ctx) {
  const slide = presentation.slides.add();
  addBg(slide, ctx, 4);
  title(slide, ctx, 'MODULE', 'Moduleは構造と境界だけを書く', 'providersを外へ出すかどうかもModuleの責務');
  doDont(
    slide,
    ctx,
`@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}`,
`@Module({
  imports: [],
  controllers: [
    UsersController,
    LessonsController,
    TypingController,
  ],
  providers: [
    UsersService,
    LessonsService,
    TypingService,
  ],
})
export class AppModule {}`,
  );
  footer(slide, ctx);
  return slide;
}
