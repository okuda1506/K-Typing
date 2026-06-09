export const authConfig = () => ({
    bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS ?? 10),
    jwtSecret: process.env.JWT_SECRET ?? '',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
});
