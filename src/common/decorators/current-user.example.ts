/**
 * Example usage of CurrentUser and OptionalCurrentUser decorators
 * This file demonstrates best practices for using the decorators
 */

import { Controller, Get, Post, Body } from '@nestjs/common';
import { CurrentUser, OptionalCurrentUser } from './index';
import { UserDto } from '../../users/dto/user.dto';

@Controller('examples')
export class ExampleController {
  /**
   * Get full user object (requires authentication)
   * Returns the complete user object without password
   */
  @Get('profile')
  getProfile(@CurrentUser() user: UserDto): UserDto {
    return user;
  }

  /**
   * Extract just the user ID (requires authentication)
   * More efficient when you only need a specific field
   */
  @Post('create-post')
  createPost(
    @CurrentUser('id') userId: number,
    @Body() postData: any,
  ) {
    return {
      userId,
      message: 'Post created',
      data: postData,
    };
  }

  /**
   * Extract user email (requires authentication)
   */
  @Get('email')
  getEmail(@CurrentUser('email') email: string): { email: string } {
    return { email };
  }

  /**
   * Optional user - works for both authenticated and anonymous requests
   * Returns user if authenticated, undefined otherwise
   */
  @Get('search')
  search(
    @OptionalCurrentUser() user: UserDto | undefined,
    @Body() query: any,
  ) {
    if (user) {
      return {
        message: 'Search results for authenticated user',
        userId: user.id,
        query,
      };
    }
    return {
      message: 'Search results for anonymous user',
      query,
    };
  }

  /**
   * Extract optional user ID field
   */
  @Get('feed')
  getFeed(@OptionalCurrentUser('id') userId?: number) {
    if (userId) {
      return {
        message: 'Personalized feed',
        userId,
      };
    }
    return {
      message: 'Public feed',
    };
  }
}
