import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GuideProfilesService } from './guide-profiles.service';
import { CreateGuideProfileDto } from './dto/create-guide-profile.dto';
import { UpdateGuideProfileDto } from './dto/update-guide-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators';
import { UserDto } from './dto/user.dto';

@Controller('guide-profiles')
export class GuideProfilesController {
  constructor(private readonly guideProfilesService: GuideProfilesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createGuideProfileDto: CreateGuideProfileDto,
    @CurrentUser() user: UserDto,
  ) {
    // Ensure user can only create profile for themselves
    createGuideProfileDto.userId = user.id;
    return await this.guideProfilesService.create(createGuideProfileDto);
  }

  @Get()
  async findAll() {
    return await this.guideProfilesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.guideProfilesService.findById(id);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    return await this.guideProfilesService.findByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGuideProfileDto: UpdateGuideProfileDto,
    @CurrentUser() user: UserDto,
  ) {
    const profile = await this.guideProfilesService.findById(id);
    
    // Only allow update if it's the user's own profile or admin
    if (profile.userId !== user.id && user.role !== 'ADMIN') {
      throw new Error('Forbidden');
    }

    return await this.guideProfilesService.update(id, updateGuideProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/approve')
  async approve(@Param('id') id: string, @CurrentUser() user: UserDto) {
    // Only admins can approve
    if (user.role !== 'ADMIN') {
      throw new Error('Forbidden: Admin access required');
    }
    return await this.guideProfilesService.approve(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: UserDto) {
    const profile = await this.guideProfilesService.findById(id);
    
    // Only allow delete if it's the user's own profile or admin
    if (profile.userId !== user.id && user.role !== 'ADMIN') {
      throw new Error('Forbidden');
    }

    await this.guideProfilesService.remove(id);
    return { message: 'Guide profile deleted successfully' };
  }
}
