import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tour } from './entities/tour.entity';
import { ToursService } from './tours.service';
import { ToursController } from './tours.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tour]), UsersModule],
  providers: [ToursService],
  controllers: [ToursController],
  exports: [ToursService]
})
export class ToursModule {}
