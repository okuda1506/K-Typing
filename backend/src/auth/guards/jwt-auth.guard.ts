import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends PassportAuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        // JWTトークンの検証
        return super.canActivate(context); // 親クラス（PassportAuthGuard('jwt')）の canActivate() を呼ぶ
    }

    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }

        return user;
    }
}
