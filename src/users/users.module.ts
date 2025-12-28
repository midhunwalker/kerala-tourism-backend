import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { GuideProfile } from './entities/guide-profile.entity';
import { GuideProfilesService } from './guide-profiles.service';
import { GuideProfilesController } from './guide-profiles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, GuideProfile])],
  controllers: [UsersController, GuideProfilesController],
  providers: [UsersService, GuideProfilesService],
  exports: [UsersService, GuideProfilesService],
})
export class UsersModule {}
