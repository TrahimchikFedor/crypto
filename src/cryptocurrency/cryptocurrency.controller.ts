import { Controller, Get } from '@nestjs/common';
import { CryptocurrencyService } from './cryptocurrency.service';
import { Public } from '../auth/decorators/public.guard';
import { MetadataService } from './metadata.service';

@Controller('cryptocurrency')
export class CryptocurrencyController {
    constructor(
        private readonly cryptocurrencyService: CryptocurrencyService,
        private readonly metadataService: MetadataService,
    ) {}

    @Get('/getPrice')
    async getPrice() {
        return await this.cryptocurrencyService.getPrice();
    }
}
