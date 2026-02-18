import { Controller, Get, Param, Query } from '@nestjs/common';
import { CryptocurrencyService } from './cryptocurrency.service';
import { Public } from '../auth/guards/public.guard';
import { MetadataService } from './metadata.service';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
} from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('cryptocurrency')
export class CryptocurrencyController {
    constructor(
        private readonly cryptocurrencyService: CryptocurrencyService,
    ) {}

    @ApiOperation({
        summary: 'Get current price',
    })
    @ApiQuery({
        name: 'symbol',
        description: 'Cryptocurrency',
        example: 'BTC',
        type: String,
    })
    @ApiQuery({
        name: 'currency',
        description:
            "Currency. If not provided, the user's default currency from database will be used",
        example: 'USD',
        type: String,
        required: false,
    })
    @ApiOkResponse({
        description: 'Exchange rate',
        schema: {
            type: 'object',
            additionalProperties: {
                type: 'number',
            },
        },
        example: {
            USD: 10,
        },
    })
    @Get('getPrice')
    async getPrice(
        @Authorized() user,
        @Query('symbol') symbol: string,
        @Query('currency') currency?: string,
    ) {
        console.log(user);
        return await this.cryptocurrencyService.getSinglePrice(
            user,
            symbol,
            currency,
        );
    }
}
