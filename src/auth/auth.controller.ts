import { Controller, Request, Post, UseGuards, Body, Get, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/local.guard';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.guard';
import { UserDto } from './dto/user.dto';
import { RefreshTokenDto, ResponseTokensDto } from './dto/token.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}


    @ApiOperation({
        summary:"Authorization"
    })
    @ApiBody({
        type: UserDto
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: ResponseTokensDto
    })
    @HttpCode(HttpStatus.OK)
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Body() dto: UserDto): Promise<ResponseTokensDto>{
        return await this.authService.login(dto);
    }

    @ApiOperation({
        summary: "Registration"
    })
    @ApiBody({
        type: UserDto
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: ResponseTokensDto
    })
    @HttpCode(HttpStatus.CREATED)
    @Public()
    @Post('/register')
    async register(@Body() dto: UserDto): Promise<ResponseTokensDto>{
        return await this.authService.register(dto);
    }

    @ApiOperation({
        summary: "Refresh tokens"
    })
    @ApiBody({
        type: RefreshTokenDto
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: ResponseTokensDto
    })
    @HttpCode(HttpStatus.OK)
    @Public()
    @Post('/refresh')
    async refreshToken(@Body() dto: RefreshTokenDto): Promise<ResponseTokensDto>{
        return await this.authService.refresh(dto.refreshToken);
    }

    @Get("/profile")
    async profile(){
        return 'hello world';
    }

    

    
}
