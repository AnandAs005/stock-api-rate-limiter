import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { UserTier } from '../enums/user-tier.enum';

export interface User {
  id: string;
  name: string;
  apiKey: string;
  tier: UserTier;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  // Hardcoded static users (Always available)
  private readonly staticUsers: User[] = [
    {
      id: 'static-free-id',
      name: 'Free User',
      apiKey: 'api_key_free_123',
      tier: UserTier.FREE,
    },
    {
      id: 'static-premium-id',
      name: 'Premium User',
      apiKey: 'api_key_premium_123',
      tier: UserTier.PREMIUM,
    },
  ];

  /**
   * Finds a user by their unique API Key (Static only).
   * @param apiKey The API key provided in headers
   */
  async findByApiKey(apiKey: string): Promise<User> {
    this.logger.debug(`Searching for static user with API Key: "${apiKey}"`);

    const user = this.staticUsers.find((u) => u.apiKey === apiKey);
    if (!user) {
      throw new NotFoundException('Invalid API Key provided');
    }
    return user;
  }

  /**
   * Get all static users
   */
  async findAll(): Promise<User[]> {
    return [...this.staticUsers];
  }
}
