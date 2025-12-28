import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserDto } from '../../users/dto/user.dto';

/**
 * CurrentUser Decorator - Extracts authenticated user from request
 *
 * @example
 * // Get full user object (excludes password)
 * async updateProfile(@CurrentUser() user: UserDto) {
 *   console.log(user.id, user.email);
 * }
 *
 * @example
 * // Extract specific field
 * async createPost(@CurrentUser('id') userId: number) {
 *   return this.postService.create(userId, postData);
 * }
 *
 * @example
 * // Optional - won't throw error if user not authenticated
 * async getMetadata(@OptionalCurrentUser() user?: UserDto) {
 *   if (!user) return publicMetadata;
 *   return userSpecificMetadata;
 * }
 *
 * @param data - Optional field name to extract (e.g., 'id', 'email')
 * @param ctx - NestJS ExecutionContext
 * @returns User object or extracted field value
 * @throws UnauthorizedException if user is not authenticated and decorator is required
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): UserDto | any => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // Validate user exists
    if (!user) {
      throw new UnauthorizedException('User not found in request. Ensure JWT guard is applied.');
    }

    // Return specific field if requested
    if (data) {
      const value = user[data];
      if (value === undefined) {
        throw new UnauthorizedException(`User property '${data}' not found.`);
      }
      return value;
    }

    // Return full user object (password already excluded by strategy)
    return user;
  },
);

/**
 * OptionalCurrentUser Decorator - Extracts user if authenticated, otherwise returns undefined
 * Useful for routes that work for both authenticated and anonymous users
 *
 * @example
 * async searchPosts(@OptionalCurrentUser() user?: UserDto) {
 *   return this.postService.search(filters, user?.id);
 * }
 */
export const OptionalCurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): UserDto | any | undefined => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // Return undefined if no user (for optional routes)
    if (!user) {
      return undefined;
    }

    // Return specific field if requested
    if (data) {
      return user[data];
    }

    // Return full user object
    return user;
  },
);
