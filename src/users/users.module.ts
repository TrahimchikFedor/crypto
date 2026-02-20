import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    providers: [UsersService],
    exports: [UsersService],
    controllers: [UsersController],
})
export class UsersModule {}
