import { Body, Controller, Get, HttpCode, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { User } from 'generated/prisma/client';
import { UpdateUserProfileDto, UserPreferenceDto } from 'src/auth/dto/user.dto';
import { PrismaClientUnknownRequestError } from 'generated/prisma/internal/prismaNamespace';

@ApiBearerAuth('access-token')
@Controller('user')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({
        summary: 'Get user settings',
    })
    @ApiResponse({
        type: UserPreferenceDto,
    })
    @Get('/profile')
    async getProfile(@Authorized() user) {
        return await this.usersService.getProfile(user);
    }

    @ApiOperation({
        summary: 'Modify user settings',
    })
    @ApiBody({
        type: UpdateUserProfileDto,
    })
    @Patch('/profile')
    async changeProfile(@Authorized() user, @Body() dto: UpdateUserProfileDto) {
        return await this.usersService.changeProfile(user, dto);
    }
}
