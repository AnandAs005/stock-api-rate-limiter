import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserTier } from '../enums/user-tier.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique user identifier',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'John Doe', description: 'User fullName' })
  @Column()
  name: string;

  @ApiProperty({
    example: 'api_key_123',
    description: 'Unique API Key for authentication',
  })
  @Column({ unique: true })
  apiKey: string;

  @ApiProperty({ enum: UserTier, description: 'User subscription tier' })
  @Column({
    type: 'enum',
    enum: UserTier,
    default: UserTier.FREE,
  })
  tier: UserTier;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
