import { PublicUser } from './public-user.type';

export type UserWithPassword = PublicUser & {
    password: string;
};
