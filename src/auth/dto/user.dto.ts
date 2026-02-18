import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsArray,
    IsISO4217CurrencyCode,
    IsOptional,
    IsString,
    IsNotEmpty,
    Validate,
    ValidateIf,
    MinLength,
    MaxLength,
} from 'class-validator';
import { DifferentFieldsConstraint } from '../decorators/differentFields.decorator';

export class LoginUserDto {
    @ApiProperty({
        example: 'username',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        example: 'password',
        type: String,
        minLength: 8,
        maxLength: 30,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(30)
    password: string;
}

export class RegisterUserDto {
    @ApiProperty({
        example: 'username',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        example: 'password',
        type: String,
        minLength: 8,
        maxLength: 30,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(30)
    password: string;

    @ApiProperty({
        example: ['ETC', 'BTC'],
        type: [String],
    })
    @IsArray()
    @IsNotEmpty()
    @IsString({ each: true })
    @Transform(({ value }) => value.map((item) => item.toUpperCase()))
    preferredCryptocurrency: string[];

    @ApiProperty({
        example: ['USD'],
        type: [String],
        default: ['USD'],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @IsISO4217CurrencyCode({ each: true })
    preferredCurrency?: string[];
}

export class UpdateUserProfileDto {
    @ApiProperty({
        example: ['ETC', 'BTC'],
        type: [String],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) => value.map((item) => item.toUpperCase()))
    preferredCryptocurrency?: string[];

    @ApiProperty({
        example: ['USD'],
        type: [String],
        default: ['USD'],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @IsISO4217CurrencyCode({ each: true })
    preferredCurrency?: string[];

    @ApiProperty({
        description: 'required if newPassword exists',
        example: 'oldPassword',
        type: String,
        minLength: 8,
        maxLength: 30,
        required: false,
    })
    @IsOptional()
    @IsString()
    @MinLength(8)
    @MaxLength(30)
    existsPassword?: string;

    @ApiProperty({
        description: 'required if existsPassword exists',
        example: 'newPassword',
        type: String,
        minLength: 8,
        maxLength: 30,
        required: false,
    })
    @ValidateIf(
        (o) => o.existsPassword !== undefined && o.existsPassword !== null,
    )
    @Validate(DifferentFieldsConstraint, ['existsPassword'])
    @IsOptional()
    @IsString()
    @MinLength(8)
    @MaxLength(30)
    newPassword?: string;
}

export class UserPreferenceDto {
    @ApiProperty({
        description: 'Username',
        example: '111111111',
    })
    username: string;

    @ApiProperty({
        description: 'List of preferred cryptocurrencies',
        example: ['ETC'],
        type: [String],
    })
    preferredCryptocurrency: string[];

    @ApiProperty({
        description: 'List of preferred fiat currencies',
        example: ['BYN', 'RUB'],
        type: [String],
    })
    preferredCurrency: string[];
}
