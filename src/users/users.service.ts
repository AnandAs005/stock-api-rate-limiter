import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserTier } from './enums/user-tier.enum';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Finds a user by their unique API Key
   * @param apiKey The API key provided in headers
   */
  async findByApiKey(apiKey: string): Promise<User> {
    this.logger.debug(`Searching for user with API Key: "${apiKey}"`);
    const user = await this.userRepository.findOne({ where: { apiKey } });
    if (!user) {
      throw new NotFoundException('Invalid API Key provided');
    }
    return user;
  }

  /**
   * Creates a new user (for testing/demo purposes)
   */
  async create(name: string, apiKey: string, tier: UserTier): Promise<User> {
    const user = this.userRepository.create({ name, apiKey, tier });
    return this.userRepository.save(user);
  }

  /**
   * Get all users
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
