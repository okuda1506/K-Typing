import { addBg, doDont, footer, title } from './_shared.mjs';

export async function slide05(presentation, ctx) {
  const slide = presentation.slides.add();
  addBg(slide, ctx, 5);
  title(slide, ctx, 'CONTROLLER', 'ControllerはHTTPの薄い入口にする', 'ルーティング、DTO受け取り、Service呼び出し、レスポンス返却だけ');
  doDont(
    slide,
    ctx,
`@Post('signup')
async signUp(@Body() dto: SignUpDto) {
  return this.authService.signUp(dto);
}

@Get('me')
async me(@CurrentUser() user: AuthUser) {
  return this.usersService.findMe(user.id);
}`,
`@Post('signup')
async signUp(@Body() body: any) {
  const exists = await prisma.user.findFirst(...);
  if (exists) throw new Error('duplicate');

  const hash = await bcrypt.hash(body.password, 10);
  const user = await prisma.user.create(...);
  return jwt.sign({ sub: user.id });
}`,
  );
  footer(slide, ctx);
  return slide;
}
