import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { MetadataService } from './metadata.service';
import { console } from 'inspector';

@Injectable()
export class CryptocurrencyService {
    constructor(
        private readonly httpService: HttpService,
        private readonly metadataService: MetadataService,
    ) {}

    async getSinglePrice(symbol: string) {
        if (!this.metadataService.exists(symbol)) {
            throw new NotFoundException('Такая криптовалюта не найдена');
        }

        try {
            const url = 'https://min-api.cryptocompare.com/data';
            const params = {
                fsyms: symbol,
                tsyms: 'USD',
            };

            const response = await firstValueFrom(
                this.httpService.get(url, { params }),
            );

            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
