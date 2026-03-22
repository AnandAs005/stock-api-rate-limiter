import { Injectable } from '@nestjs/common';
import { StockPriceResponseDto } from './dto/stock-price-response.dto';

@Injectable()
export class StockService {
  /**
   * Fetches the current stock price for a given symbol.
   * In a real-world scenario, this would call an external API like Alpha Vantage or Yahoo Finance.
   * @param symbol The stock symbol (e.g., AAPL)
   */
  async getPrice(symbol: string): Promise<StockPriceResponseDto> {
    // Simulating a database/API call
    const mockPrice = (Math.random() * 1000).toFixed(2);

    return {
      symbol: symbol.toUpperCase(),
      price: parseFloat(mockPrice),
      currency: 'USD',
      timestamp: new Date().toISOString(),
    };
  }
}
