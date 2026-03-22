import { ApiProperty } from '@nestjs/swagger';

export class StockPriceResponseDto {
  @ApiProperty({ example: 'AAPL', description: 'Stock symbol' })
  symbol: string;

  @ApiProperty({ example: 150.25, description: 'Current stock price' })
  price: number;

  @ApiProperty({ example: 'USD', description: 'Currency' })
  currency: string;

  @ApiProperty({
    example: '2026-03-22T20:00:00Z',
    description: 'Timestamp of the price',
  })
  timestamp: string;
}
