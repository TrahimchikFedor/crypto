import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Logger, OnModuleInit, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import type { Cache } from 'cache-manager';

@Injectable()
export class MetadataService implements OnModuleInit {
    private readonly logger = new Logger(MetadataService.name);

    private readonly CACHE_KEY = 'CRYPTO_COIN_LIST';

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private httpService: HttpService,
    ) {}

    async onModuleInit() {
        await this.refreshMetadata();
    }

    @Cron(CronExpression.EVERY_12_HOURS)
    async handleCron() {
        this.logger.log('Запуск планового обновления кеша валют...');
        await this.refreshMetadata();
    }

    async refreshMetadata() {
        try {
            const { data } = await this.httpService.axiosRef.get(
                'https://min-api.cryptocompare.com/data/all/coinlist',
            );

            await this.cacheManager.set(this.CACHE_KEY, data.Data);
            this.logger.log('Кеш валют успещно обновлен.');
        } catch (e) {
            this.logger.error(
                `Критическая ошибка при обновлении кеша: ${e.message}`,
            );
        }
    }

    async getCoinData() {
        let data = await this.cacheManager.get<Record<string, any>>(
            this.CACHE_KEY,
        );

        if (!data) {
            this.logger.warn('Кеш пуст при запросе! Обновление...');
            await this.refreshMetadata();
            data = await this.cacheManager.get<Record<string, any>>(
                this.CACHE_KEY,
            );
        }

        return data;
    }

    async exists(symbol: string): Promise<boolean> {
        const data = await this.getCoinData();
        return !!data?.[symbol];
    }

    async getInfo(symbol: string) {
        const data = await this.getCoinData();
        const coin = data?.[symbol];

        if (!coin) return null;
        return {
            name: coin.FullName,
            symbol: coin.Symbol,
            logo: `https://www.cryptocompare.com${coin.ImageUrl}`,
        };
    }
}
