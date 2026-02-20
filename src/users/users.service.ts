import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
    StreamableFile,
} from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { RegisterUserDto } from 'src/auth/dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { response, Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';

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

    async updateAvatar(username: string, file: Express.Multer.File) {
        const avatarPath = `/uploads/avatars/${file.filename}`;

        const updatedUser = await this.prismaService.user.update({
            where: { username },
            data: {
                avatar: avatarPath,
            },
        });

        if (!updatedUser) {
            throw new BadRequestException();
        }

        return {
            message: 'Avatar uploaded successfully',
            avatarPath: updatedUser.avatar,
        };
    }

    async getAvatar(username: string, filename: string, response: Response) {
        const filePath = join(process.cwd(), 'uploads', 'avatars', filename);

        if (!existsSync(filePath)) {
            throw new NotFoundException(
                'Файл физически отсутствует на сервере',
            );
        }

        const fileOwner = await this.findOne(username);

        if (!fileOwner) {
            throw new NotFoundException('Пользователь не найден');
        }

        if (!fileOwner.avatar) {
            throw new NotFoundException('У пользователя нет аватара');
        }

        const isOwner = fileOwner.avatar.endsWith(filename);

        if (!isOwner) {
            throw new ForbiddenException(
                'Этот файл не принадлежит данному пользователю',
            );
        }

        const file = createReadStream(filePath);
        return new StreamableFile(file, {
            type: 'image/png',
            disposition: 'inline; filename="image.png"',
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
