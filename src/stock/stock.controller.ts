import { Controller, Get, Param } from '@nestjs/common';
import { StockService } from './stock.service';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { StockPriceResponseDto } from './dto/stock-price-response.dto';

@ApiTags('Stock')
@Controller('stock-price')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  /**
   * Returns the current stock price for a symbol.
   * Rate limited: 5 req/min for Free users, 100 req/min for Premium users.
   */
  @Get(':symbol')
  @ApiOperation({ summary: 'Get current stock price' })
  @ApiHeader({
    name: 'x-api-key',
    description: 'API Key for authentication and rate limiting',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: StockPriceResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - API Key missing or invalid',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests - Rate limit exceeded',
  })
  async getPrice(
    @Param('symbol') symbol: string,
  ): Promise<StockPriceResponseDto> {
    return this.stockService.getPrice(symbol);
  }
}
