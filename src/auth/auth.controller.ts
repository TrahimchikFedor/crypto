import { Controller, Request, Post, UseGuards, Body, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/local.guard';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.guard';
import { UserDto } from './dto/user.dto';
import { RefreshTokenDto } from './dto/token.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}


    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Body() dto: UserDto) {
        return await this.authService.login(dto);
    }

    @Public()
    @Post('/register')
    async register(@Body() dto: UserDto){
        return await this.authService.register(dto);
    }

    @Public()
    @Post('/refresh')
    async refreshToken(@Body() dto: RefreshTokenDto){
        return await this.authService.refresh(dto.refreshToken);
    }

    @Get("/profile")
    async profile(){
        return 'hello world';
    }

    

    
}
