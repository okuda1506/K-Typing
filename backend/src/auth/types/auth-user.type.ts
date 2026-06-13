/**
 * JWT検証後にrequest.userへ載せるアプリ内部の認証ユーザー
 * JwtPayload.subをidへ変換してControllerやServiceから扱いやすくする
 */
export type AuthUser = {
    id: string;
    email: string;
};
