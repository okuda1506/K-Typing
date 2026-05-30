import { C, addBg, bulletList, footer, ruleCard, title } from './_shared.mjs';

export async function slide13(presentation, ctx) {
  const slide = presentation.slides.add();
  addBg(slide, ctx, 13);
  title(slide, ctx, 'K-TYPING RULES', '本アプリでの実装チェックリスト', '迷ったらこの順番で確認する');
  ruleCard(slide, ctx, 'Auth', 'AuthControllerはsignup/signin/signoutのみ\npassword hashとJWT発行はAuthService\nUser作成はUsersService', 80, 250, 500, 112, C.green);
  ruleCard(slide, ctx, 'Typing', 'TypingSessionsControllerはREST入口\n判定はTypingJudgeService、保存/集計はTypingSessionsService', 700, 250, 500, 112, C.blue);
  bulletList(slide, ctx, [
    'Moduleは機能単位: auth / users / onboarding / home / lessons / typing / vocab',
    'DTOなしの@Body()は禁止、anyも原則禁止',
    'Controller内でPrismaを直接呼ばない',
    'Service間共有はexports/importsで明示',
    '@Global()は使わない、例外が必要なら理由をREADMEか設計書に残す',
    'REST APIのレスポンスDTOは05_API設計シートと揃える',
  ], 110, 414, 1040, { size: 18, gap: 33, dot: C.ink });
  footer(slide, ctx);
  return slide;
}
