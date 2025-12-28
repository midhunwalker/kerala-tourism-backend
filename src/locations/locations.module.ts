import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { District } from './entities/district.entity';
import { DistrictsService } from './districts.service';
import { DistrictsController } from './districts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([District])],
  providers: [DistrictsService],
  controllers: [DistrictsController],
  exports: [DistrictsService]
})
export class LocationsModule {}
