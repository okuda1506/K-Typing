import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthUser } from '../types/auth-user.type';
import { JwtPayload } from '../types/jwt-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        // 親クラスのconstructorを呼び出してJWT認証の設定を渡す
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Authorization: Bearer <token> からtokenを取り出す
            ignoreExpiration: false, // JWTの有効期限チェック
            secretOrKey: configService.getOrThrow<string>('jwtSecret'), // JWT署名検証に使う秘密鍵
        });
    }

    // 検証成功後に自動呼び出し
    validate(payload: JwtPayload): AuthUser {
        return {
            id: payload.sub,
            email: payload.email,
        };
    }
}
