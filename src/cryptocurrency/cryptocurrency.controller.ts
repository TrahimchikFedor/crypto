import { Controller, Get, Param } from '@nestjs/common';
import { CryptocurrencyService } from './cryptocurrency.service';
import { Public } from '../auth/guards/public.guard';
import { MetadataService } from './metadata.service';
import { User } from 'src/auth/decorators/user.decorator';

@Controller('cryptocurrency')
export class CryptocurrencyController {
    constructor(
        private readonly cryptocurrencyService: CryptocurrencyService,
        private readonly metadataService: MetadataService,
    ) {}

    @Get('getPrice/:symbol')
    async getPrice(@Param('symbol') symbol: string, @User() user?) {
        console.log(user);
        return await this.cryptocurrencyService.getSinglePrice(symbol, user);
    }
}
