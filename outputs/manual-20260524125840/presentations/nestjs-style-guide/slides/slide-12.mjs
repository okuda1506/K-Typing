import { addBg, doDont, footer, title } from './_shared.mjs';

export async function slide12(presentation, ctx) {
  const slide = presentation.slides.add();
  addBg(slide, ctx, 12);
  title(slide, ctx, 'DEPENDENCY INJECTION', '依存は new せずconstructorで注入する', 'NestのIoCコンテナにライフサイクルと依存解決を任せる');
  doDont(
    slide,
    ctx,
`@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }
}`,
`@Injectable()
export class UsersService {
  private prisma = new PrismaService();

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }
}`,
  );
  footer(slide, ctx);
  return slide;
}
