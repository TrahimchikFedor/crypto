import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { RegisterUserDto } from 'src/auth/dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
    constructor(private prismaService: PrismaService) {}

    async findOne(username: string): Promise<User | null> {
        const user = await this.prismaService.user.findFirst({
            where: {
                username,
            },
        });

        return user;
    }

    async createUser(user: RegisterUserDto) {
        const hashedPassword = await argon2.hash(user.password);

        return await this.prismaService.user.create({
            data: {
                ...user,
                password: hashedPassword,
            },
        });
    }

    async getProfile(user) {
        const existsUser = await this.findOne(user.username);

        if (!existsUser) {
            throw new NotFoundException('Пользователь не найден');
        }
        return {
            username: existsUser.username,
            preferredCryptocurrency: existsUser.preferredCryptocurrency,
            preferredCurrency: existsUser.preferredCurrency,
        };
    }

    async changeProfile(user, updateDto) {
        const existsUser = await this.findOne(user.username);

        if (!existsUser) {
            throw new NotFoundException('Пользователь не найден');
        }

        if (updateDto.existsPassword) {
            if (
                await argon2.verify(
                    existsUser.password,
                    updateDto.existsPassword,
                )
            ) {
                updateDto.newPassword = await argon2.hash(
                    updateDto.newPassword,
                );

                return await this.prismaService.user.update({
                    where: { username: existsUser.username },
                    data: {
                        password: updateDto.newPassword,
                        preferredCryptocurrency:
                            updateDto.preferredCryptocurrency,
                        preferredCurrency: updateDto.preferredCurrency,
                    },
                    select: {
                        password: true,
                        preferredCryptocurrency: true,
                        preferredCurrency: true,
                    },
                });
            } else {
                throw new BadRequestException('Пароли не совпадают');
            }
        }

        return await this.prismaService.user.update({
            where: { username: user.username },
            data: {
                preferredCryptocurrency: updateDto.preferredCryptocurrency,
                preferredCurrency: updateDto.preferredCurrency,
            },
            select: {
                preferredCryptocurrency: true,
                preferredCurrency: true,
            },
        });
    }
}
