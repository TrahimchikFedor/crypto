import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenDto{

    @ApiProperty({
        example:"token_string"
    })
    refreshToken: string
}

export class ResponseTokensDto{
    @ApiProperty()
    accessToken: string

    @ApiProperty()
    refreshToken: string
}