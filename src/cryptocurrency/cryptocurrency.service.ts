import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { MetadataService } from './metadata.service';
import { console } from 'inspector';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CryptocurrencyService {
    constructor(
        private readonly httpService: HttpService,
        private readonly metadataService: MetadataService,
        private readonly usersService: UsersService,
    ) {}

    async getSinglePrice(userDto, symbol: string, currency?: string) {
        const user = await this.usersService.findOne(userDto.username);

        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        if (!(await this.metadataService.exists(symbol))) {
            throw new NotFoundException('Такая криптовалюта не найдена');
        }

        try {
            const url = 'https://min-api.cryptocompare.com/data/price';
            const params = {
                fsym: symbol ? symbol : user.preferredCryptocurrency,
                tsyms: currency ? currency : user.preferredCurrency.join(','),
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
