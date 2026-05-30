import { C, addBg, code, footer, ruleCard, title } from './_shared.mjs';

export async function slide11(presentation, ctx) {
  const slide = presentation.slides.add();
  addBg(slide, ctx, 11);
  title(slide, ctx, 'CLI FIRST', '新規ファイルはNest CLIで作る', 'タイポ、登録漏れ、命名揺れを減らす\nまずCLI、細部は自分で調整');
  code(slide, ctx,
`# feature一式をまとめて作る
nest g resource users

# 個別に作る
nest g module users
nest g controller users
nest g service users

# 認証・横断処理
nest g guard auth/guards/jwt-auth
nest g interceptor common/interceptors/logging
nest g pipe common/pipes/parse-object-id
nest g filter common/filters/http-exception

# DTO / Provider
nest g class users/dto/create-user.dto --no-spec
nest g provider users/repositories/user`, 80, 238, 590, 340, { size: 11.2 });
  ruleCard(slide, ctx, '最初に使う', '`nest g resource` はModule / Controller / Service / DTOの雛形をまとめて作れる\nREST開発の初期作成に便利', 710, 242, 400, 142, C.blue);
  ruleCard(slide, ctx, '個別に使う', '既存featureへGuard、Pipe、Interceptor、Filterを足すときは個別generatorを使う\n配置先のパスを明示する', 710, 406, 400, 126, C.ink);
  ruleCard(slide, ctx, '禁止', '手作成しない、登録漏れと命名揺れを避ける', 710, 546, 400, 88, C.red);
  footer(slide, ctx);
  return slide;
}
