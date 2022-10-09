import * as jwt from 'jsonwebtoken';
import {Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import authConfig from 'src/config/authConfig';
import { ConfigType } from '@nestjs/config';
import {UserInfo} from "../users/type/userInfo.type";

interface User {
    id: string;
    name: string;
    email: string;
}

@Injectable()
export class AuthService {
    constructor(
        @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>,
    ) { }

    login(user: User) {
        const payload = { ...user };

        return jwt.sign(payload, this.config.jwtSecret, {
            expiresIn: '1d',
            audience: 'example.com',
            issuer: 'example.com',
        });
    }

    verify(jwtString: string): UserInfo {
        try {
            const payload = jwt.verify(jwtString, this.config.jwtSecret) as (jwt.JwtPayload | string) & User;

            const { id, email, name } = payload;

            return {
                id,
                name,
                email,
            }

        } catch (e) {
            throw new UnauthorizedException()
        }
    }
}