import { C, addBg, code, footer, ruleCard, title } from './_shared.mjs';

export async function slide10(presentation, ctx) {
  const slide = presentation.slides.add();
  addBg(slide, ctx, 10);
  title(slide, ctx, 'DTO + VALIDATION', '入力はDTOで受け、ValidationPipeで落とす', 'Controller内if文でバリデーションを増やさない');
  code(slide, ctx,
`export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MaxLength(100)
  displayName: string;
}`, 80, 250, 520, 270, { size: 14 });
  code(slide, ctx,
`app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);`, 680, 250, 430, 160, { size: 14 });
  ruleCard(slide, ctx, 'ルール', 'DTOはclassで定義する\ninterfaceやtypeだけでは実行時validationに必要なメタデータが残らない', 680, 452, 430, 118, C.blue);
  footer(slide, ctx);
  return slide;
}
