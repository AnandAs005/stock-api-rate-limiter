import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserTier } from '../enums/user-tier.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'User fullName' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'api_key_premium_123',
    description: 'Unique API Key for authentication',
  })
  @IsString()
  @IsNotEmpty()
  apiKey: string;

  @ApiProperty({
    enum: UserTier,
    example: UserTier.FREE,
    description: 'User subscription tier',
  })
  @IsEnum(UserTier)
  tier: UserTier;
}
