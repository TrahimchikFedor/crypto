import { Injectable } from '@nestjs/common';
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
                username: user.username,
                password: hashedPassword,
            },
        });
    }
}
