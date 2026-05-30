import { addBg, doDont, footer, title } from './_shared.mjs';

export async function slide06(presentation, ctx) {
  const slide = presentation.slides.add();
  addBg(slide, ctx, 6);
  title(slide, ctx, 'SERVICE / PROVIDER', 'Serviceは業務処理とデータ操作を持つ', 'Prisma、判定ロジック、外部API連携はServiceへ寄せる');
  doDont(
    slide,
    ctx,
`@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: SignUpDto) {
    const user = await this.usersService.create(dto);
    return this.issueToken(user.id);
  }
}`,
`@Injectable()
export class AuthService {
  async signUp(dto: any) {
    const usersService = new UsersService();
    const jwtService = new JwtService({});
    const user = await usersService.create(dto);
    return jwtService.sign({ sub: user.id });
  }
}`,
  );
  footer(slide, ctx);
  return slide;
}
