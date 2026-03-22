import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../../users/users.service';
import { UserTier } from '../../users/enums/user-tier.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RateLimiterMiddleware.name);
  private counts = new Map<string, { count: number; expiresAt: number }>();

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      throw new HttpException(
        'API Key missing in headers (x-api-key)',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const user = await this.usersService.findByApiKey(apiKey);
      const isPremium = user.tier === UserTier.PREMIUM;

      const limit = Number(
        isPremium
          ? this.configService.get<number>('THROTTLE_LIMIT_PREMIUM') || 100
          : this.configService.get<number>('THROTTLE_LIMIT_FREE') || 5,
      );

      const now = Date.now();
      const windowMs = 60 * 1000;

      let record = this.counts.get(apiKey);

      if (!record || now > record.expiresAt) {
        // Reset or initialize record for the new window
        record = { count: 1, expiresAt: now + windowMs };
        this.counts.set(apiKey, record);
      } else {
        record.count++;
      }

      this.logger.debug(
        `Rate limiting: API Key=${apiKey}, Tier=${user.tier}, Count=${record.count}, Limit=${limit}`,
      );

      if (record.count > limit) {
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: `Rate limit exceeded for ${user.tier} user. Maximum ${limit} calls per minute allowed.`,
            error: 'Too Many Requests',
            tier: user.tier, // Pass tier to the exception filter
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }


      next();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error in RateLimiterMiddleware: ${error.message}`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
