import { ApiProperty } from "@nestjs/swagger"


export class UserDto{
    @ApiProperty({
        example: "username"
    })
    username: string

    @ApiProperty({
        example: "password"
    })
    password: string

}