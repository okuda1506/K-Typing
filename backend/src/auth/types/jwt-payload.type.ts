/**
 * JWT内に保存するpayload
 * subにはJWTの慣習としてユーザーIDを入れる
 */
export type JwtPayload = {
    sub: string;
    email: string;
};
