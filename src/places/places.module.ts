import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './entities/place.entity';
import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';
import { LocationsModule } from '../locations/locations.module';

@Module({
  imports: [TypeOrmModule.forFeature([Place]), LocationsModule],
  providers: [PlacesService],
  controllers: [PlacesController],
  exports: [PlacesService]
})
export class PlacesModule {}
