import {
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';
import { resourceLimits } from 'worker_threads';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { LoginUserDto, RegisterUserDto } from './dto/user.dto';
import { ConfigService } from '@nestjs/config';
import { User } from 'generated/prisma/client';
import { RefreshTokenDto } from './dto/token.dto';

@Injectable()
export class AuthService {
    private readonly JWT_SECRET: string;
    private readonly JWT_ACCESS_TOKEN_TTL: JwtSignOptions['expiresIn'];
    private readonly JWT_REFRESH_TOKEN_TTL: JwtSignOptions['expiresIn'];

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {
        this.JWT_SECRET = this.configService.getOrThrow('JWT_SECRET');
        this.JWT_ACCESS_TOKEN_TTL = this.configService.getOrThrow(
            'JWT_ACCESS_TOKEN_TTL',
        );
        this.JWT_REFRESH_TOKEN_TTL = this.configService.getOrThrow(
            'JWT_REFRESH_TOKEN_TTL',
        );
    }

    async validateUser(username: string, password: string) {
        const user = await this.usersService.findOne(username);

        if (user && (await argon2.verify(user.password, password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: LoginUserDto) {
        const existsUser = await this.usersService.findOne(user.username);

        if (!existsUser) {
            throw new NotFoundException('Пользователь не найден');
        }

        const isPasswordValid = await argon2.verify(
            existsUser.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Неверный пароль');
        }

        const tokens = await this.generateTokens(existsUser);
        return tokens;
    }

    async register(user: RegisterUserDto) {
        const existsUser = await this.usersService.findOne(user.username);

        if (existsUser) {
            throw new ConflictException('Пользователь с таким именем уже');
        }

        const newUser = await this.usersService.createUser(user);

        return await this.generateTokens(newUser);
    }

    async refresh(refreshToken: string) {
        const payload = this.jwtService.verify(refreshToken);

        if (!payload) {
            throw new UnauthorizedException('Токен недействителен');
        }

        const user = await this.usersService.findOne(payload.username);
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        return this.generateTokens(user);
    }

    async generateTokens(user: User) {
        const payload = {
            username: user.username,
            sub: user.id,
        };

        const accessToken = this.jwtService.sign(payload, {
            expiresIn: this.JWT_ACCESS_TOKEN_TTL,
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: this.JWT_REFRESH_TOKEN_TTL,
        });

        return {
            accessToken,
            refreshToken,
        };
    }
}
