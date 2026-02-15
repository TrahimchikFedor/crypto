import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { MetadataService } from './metadata.service';
import { console } from 'inspector';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CryptocurrencyService {
    constructor(
        private readonly httpService: HttpService,
        private readonly metadataService: MetadataService,
        private readonly prismaService: PrismaService,
    ) {}

    async getSinglePrice(symbol: string, userDto) {
        if (!(await this.metadataService.exists(symbol))) {
            throw new NotFoundException('Такая криптовалюта не найдена');
        }

        const user = await this.prismaService.user.findUnique({
            where: {
                username: userDto.username,
            },
        });
        try {
            const url = 'https://min-api.cryptocompare.com/data/price';
            const params = {
                fsym: symbol ? symbol : user?.preferredCryptocurrency,
                tsyms: user?.preferredCurrency.join(','),
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
