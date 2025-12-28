import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Inject
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, OptionalCurrentUser } from '../common/decorators/current-user.decorator';
import { ToursService } from './tours.service';
import { CreateTourDto, UpdateTourDto } from './dto/create-tour.dto';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';

@Controller('tours')
export class ToursController {
  constructor(
    private readonly toursService: ToursService,
    private readonly usersService: UsersService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: UserDto, @Body() createTourDto: CreateTourDto) {
    // Verify user is a guide
    if (user.role !== 'GUIDE') {
      throw new BadRequestException('Only guides can create tours');
    }

    // Get guide profile ID from user
    const userWithGuide = await this.usersService.findById(user.id);
    if (!userWithGuide.guideProfile) {
      throw new BadRequestException('User does not have a guide profile');
    }

    return this.toursService.create(userWithGuide.guideProfile.id, createTourDto);
  }

  @Get()
  async findAll(@Query('district') district?: string, @Query('guideId') guideId?: string) {
    return this.toursService.findAll({ district, guideId });
  }

  @Get('by-guide/:guideId')
  async findByGuide(@Param('guideId') guideId: string) {
    return this.toursService.findByGuide(guideId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.toursService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @CurrentUser() user: UserDto,
    @Body() updateTourDto: UpdateTourDto
  ) {
    // Get guide profile ID from user
    const userWithGuide = await this.usersService.findById(user.id);
    if (!userWithGuide.guideProfile) {
      throw new BadRequestException('User does not have a guide profile');
    }

    return this.toursService.update(id, userWithGuide.guideProfile.id, updateTourDto);
  }

  @Delete(':id/deactivate')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deactivate(@Param('id') id: string, @CurrentUser() user: UserDto) {
    // Get guide profile ID from user
    const userWithGuide = await this.usersService.findById(user.id);
    if (!userWithGuide.guideProfile) {
      throw new BadRequestException('User does not have a guide profile');
    }

    return this.toursService.deactivate(id, userWithGuide.guideProfile.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @CurrentUser() user: UserDto) {
    // Get guide profile ID from user
    const userWithGuide = await this.usersService.findById(user.id);
    if (!userWithGuide.guideProfile) {
      throw new BadRequestException('User does not have a guide profile');
    }

    await this.toursService.remove(id, userWithGuide.guideProfile.id);
  }
}
