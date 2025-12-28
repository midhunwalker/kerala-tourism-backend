import { Exclude } from 'class-transformer';
import { UserRole } from '../entities/user.entity';

/**
 * User DTO - Serialized user data without sensitive information
 * Used for returning user data to clients (excludes passwordHash)
 */
export class UserDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  passwordHash?: string;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
