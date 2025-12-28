import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { RefreshToken } from './entities/refresh-token.entity';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async generateTokens(userId: string, email: string, ipAddress?: string, userAgent?: string) {
    // Generate access token (short-lived: 15 minutes)
    const accessToken = this.jwtService.sign(
      { email, sub: userId },
      { expiresIn: '15m' }
    );

    // Generate refresh token (long-lived: 7 days)
    const refreshTokenPayload = this.jwtService.sign(
      { email, sub: userId, type: 'refresh' },
      { expiresIn: '7d' }
    );

    // Hash and store refresh token
    const hashedRefreshToken = await bcrypt.hash(refreshTokenPayload, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const storedToken = this.refreshTokenRepository.create({
      userId,
      token: hashedRefreshToken,
      expiresAt,
      ipAddress,
      userAgent,
    });

    await this.refreshTokenRepository.save(storedToken);

    return {
      accessToken,
      refreshToken: refreshTokenPayload,
    };
  }

  async signup(signupDto: SignupDto, ipAddress?: string, userAgent?: string) {
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(signupDto.password, saltRounds);

    // Create user
    const user = await this.usersService.create({
      name: signupDto.name,
      email: signupDto.email,
      passwordHash: hashedPassword,
      role: signupDto.role,
    });

    // Remove password from response
    const { passwordHash, ...result } = user;

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.email,
      ipAddress,
      userAgent
    );

    return {
      accessToken,
      refreshToken,
      user: result,
    };
  }

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.email,
      ipAddress,
      userAgent
    );

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      // Verify JWT signature
      const payload = this.jwtService.verify(refreshToken);

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      // Find stored token
      const storedTokens = await this.refreshTokenRepository.find({
        where: { userId: payload.sub },
        order: { createdAt: 'DESC' },
        take: 1,
      });

      if (!storedTokens.length) {
        throw new UnauthorizedException('Refresh token not found');
      }

      const storedToken = storedTokens[0];

      // Check if revoked or expired
      if (storedToken.isRevoked || new Date() > storedToken.expiresAt) {
        throw new UnauthorizedException('Refresh token expired or revoked');
      }

      // Verify hashed token matches
      const isValid = await bcrypt.compare(refreshToken, storedToken.token);
      if (!isValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Get user
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Revoke old token
      storedToken.isRevoked = true;
      await this.refreshTokenRepository.save(storedToken);

      // Generate new tokens
      const { passwordHash, ...userResult } = user;
      const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(
        user.id,
        user.email
      );

      return {
        accessToken,
        refreshToken: newRefreshToken,
        user: userResult,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    // Revoke all refresh tokens for user
    await this.refreshTokenRepository.update(
      { userId, isRevoked: false },
      { isRevoked: true }
    );
  }

  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const { passwordHash, ...result } = user;
      return result;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
