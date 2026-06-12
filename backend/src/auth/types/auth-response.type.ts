import { PublicUser } from '../../users/types/public-user.type';

export type AuthResponse = {
    user: PublicUser;
    accessToken: string;
};
