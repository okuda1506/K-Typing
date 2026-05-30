import { C, addBg, box, code, footer, text, title } from './_shared.mjs';

export async function slide14(presentation, ctx) {
  const slide = presentation.slides.add();
  addBg(slide, ctx, 14);
  title(slide, ctx, 'NAMING RULES', '命名規則を固定する', 'ファイル、メソッド、Prisma、DB物理名の揺れをなくす');
  code(slide, ctx,
`// file / directory
users/
  users.module.ts
  users.controller.ts
  users.service.ts
  dto/
    create-user.dto.ts
    update-profile.dto.ts

// class / method
export class UsersService {
  findById(id: string) {}
  findByEmail(email: string) {}
  create(dto: CreateUserDto) {}
  updateProfile(id: string, dto: UpdateProfileDto) {}
}`, 80, 238, 560, 340, { size: 11.5 });
  code(slide, ctx,
`model User {
  id          String   @id @default(uuid()) @db.Uuid
  displayName String? @map("display_name")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("users")
}`, 690, 238, 430, 188, { size: 12 });
  box(slide, ctx, 690, 414, 220, 216, C.paper, C.line);
  ctx.addShape(slide, { x: 690, y: 414, width: 5, height: 216, fill: C.blue });
  text(slide, ctx, 'TypeScript側', 712, 432, 176, 26, { size: 18, bold: true });
  text(slide, ctx, 'ファイル名はkebab-case\nクラス名はPascalCase\n変数・メソッド名はcamelCase', 712, 472, 176, 116, { size: 14, color: C.muted });
  box(slide, ctx, 940, 414, 220, 216, C.paper, C.line);
  ctx.addShape(slide, { x: 940, y: 414, width: 5, height: 216, fill: C.green });
  text(slide, ctx, 'DB側', 962, 432, 176, 26, { size: 18, bold: true });
  text(slide, ctx, 'テーブル名はsnake_caseの複数形\nカラム名はsnake_case\nPrisma modelは単数形PascalCase', 962, 472, 176, 116, { size: 14, color: C.muted });
  footer(slide, ctx);
  return slide;
}
