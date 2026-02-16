import { Module } from '@nestjs/common';
import { CryptocurrencyService } from './cryptocurrency.service';
import { CryptocurrencyController } from './cryptocurrency.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MetadataService } from './metadata.service';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [HttpModule, UsersModule],
    controllers: [CryptocurrencyController],
    providers: [CryptocurrencyService, MetadataService],
})
export class CryptocurrencyModule {}
