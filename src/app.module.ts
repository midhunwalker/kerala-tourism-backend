import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BookingsModule } from './bookings/bookings.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ToursModule } from './tours/tours.module';
import { LocationsModule } from './locations/locations.module';
import { PlacesModule } from './places/places.module';
import { ImagesModule } from './images/images.module';
import { FavoritesModule } from './favorites/favorites.module';
import { User } from './users/entities/user.entity';
import { GuideProfile } from './users/entities/guide-profile.entity';
import { Booking } from './bookings/entities/booking.entity';
import { Review } from './reviews/entities/review.entity';
import { Tour } from './tours/entities/tour.entity';
import { District } from './locations/entities/district.entity';
import { Place } from './places/entities/place.entity';
import { Image } from './images/entities/image.entity';
import { Favorite } from './favorites/entities/favorite.entity';
import { RefreshToken } from './auth/entities/refresh-token.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const entities = [User, GuideProfile, Booking, Review, Tour, District, Place, Image, Favorite, RefreshToken];
        if (databaseUrl) {
          console.log('[DB] Using DATABASE_URL (Neon)');
          return {
            type: 'postgres',
            url: databaseUrl,
            ssl: true,
            extra: { ssl: true },
            entities,
            synchronize: true,
            logging: true,
          } as const;
        }
        console.log('[DB] Using local connection (DB_HOST/DB_DATABASE)');
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST') || 'localhost',
          port: Number(configService.get<string>('DB_PORT') || 5432),
          username: configService.get<string>('DB_USERNAME') || 'postgres',
          password: configService.get<string>('DB_PASSWORD') || '',
          database: configService.get<string>('DB_DATABASE') || 'auth_db',
          entities,
          synchronize: true,
          logging: true,
        } as const;
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    BookingsModule,
    ReviewsModule,
    ToursModule,
    LocationsModule,
    PlacesModule,
    ImagesModule,
    FavoritesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
