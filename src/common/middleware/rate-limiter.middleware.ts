import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../services/users.service';
import { UserTier } from '../enums/user-tier.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RateLimiterMiddleware.name);
  private counts = new Map<string, { count: number; expiresAt: number }>();

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    // Periodically clean up expired entries to prevent memory leaks
    setInterval(() => this.cleanup(), 60000 * 5); // Every 5 minutes
  }

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
      const windowMs = (this.configService.get<number>('THROTTLE_TTL') || 60) * 1000;

      let record = this.counts.get(apiKey);

      if (!record || now > record.expiresAt) {
        record = { count: 1, expiresAt: now + windowMs };
        this.counts.set(apiKey, record);
      } else {
        record.count++;
      }

      if (record.count > limit) {
        this.logger.warn(`Rate limit exceeded for ${user.tier} user: ${apiKey}`);
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: `Rate limit exceeded for ${user.tier} user. Maximum ${limit} calls per minute allowed.`,
            error: 'Too Many Requests',
            tier: user.tier,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      next();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`RateLimiter Error: ${error.message}`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, record] of this.counts.entries()) {
      if (now > record.expiresAt) {
        this.counts.delete(key);
      }
    }
  }
}
