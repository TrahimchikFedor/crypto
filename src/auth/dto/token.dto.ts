import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
    @ApiProperty({
        example: 'token_string',
    })
    @IsString()
    refreshToken: string;
}

export class ResponseTokensDto {
    @ApiProperty({
        example: 'token_string',
    })
    @IsString()
    @IsNotEmpty()
    accessToken: string;

    @ApiProperty({
        example: 'token_string',
    })
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}
