import {
    Body,
    Controller,
    Get,
    MaxFileSizeValidator,
    Param,
    ParseFilePipe,
    Patch,
    Post,
    UploadedFile,
    UseInterceptors,
    Res,
    Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { UpdateUserProfileDto, UserPreferenceDto } from 'src/auth/dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Response } from 'express';

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

    @ApiOperation({
        summary: 'Upload user photo',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Uploading an image',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Image to upload',
                },
            },
        },
    })
    @Post('/avatar')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/avatars',
                filename: (req, file, callback) => {
                    const allowedMimeTypes = [
                        'image/png',
                        'image/jpg',
                        'image/jpeg',
                    ];

                    if (allowedMimeTypes.includes(file.mimetype)) {
                        const uniqueSuffix =
                            Date.now() + '-' + Math.round(Math.random() * 1e9);
                        const ext = extname(file.originalname);
                        const filename = `${uniqueSuffix}${ext}`;
                        callback(null, filename);
                    } else {
                        callback(new Error('Invalid file type'), '');
                    }
                },
            }),
        }),
    )
    async uploadFile(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
                ],
            }),
        )
        file: Express.Multer.File,
        @Authorized() user,
    ) {
        return await this.usersService.updateAvatar(user.username, file);
    }

    @ApiOperation({
        summary: 'Get user profile photo',
    })
    @Get('/avatar/:filename')
    async getAvatar(
        @Param('filename') filename: string,
        @Res({ passthrough: true }) response: Response,
        @Authorized() user,
    ) {
        return await this.usersService.getAvatar(
            user.username,
            filename,
            response,
        );
    }
}
