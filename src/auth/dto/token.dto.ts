import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenDto{

    @ApiProperty({
        example:"token_string"
    })
    refreshToken: string
}

export class ResponseTokensDto{
    @ApiProperty({
        example:"token_string"
    })
    accessToken: string

    @ApiProperty({
        example:"token_string"
    })
    refreshToken: string
}