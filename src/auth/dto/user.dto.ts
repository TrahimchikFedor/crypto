import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsArray,
    IsISO4217CurrencyCode,
    IsOptional,
    IsString,
} from 'class-validator';

export class LoginUserDto {
    @ApiProperty({
        example: 'username',
    })
    username: string;

    @ApiProperty({
        example: 'password',
    })
    password: string;
}

export class RegisterUserDto {
    @ApiProperty()
    username: string;
    @ApiProperty()
    password: string;

    @ApiProperty()
    @IsString({ each: true })
    @IsArray()
    @Transform(({ value }) => value.map((item) => item.toUpperCase()))
    preferredCryptocurrency: string[];

    @ApiProperty()
    @IsOptional()
    @IsString({ each: true })
    @IsArray()
    @IsISO4217CurrencyCode({ each: true })
    preferredCurrency?: string[];
}
