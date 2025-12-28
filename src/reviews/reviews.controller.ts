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
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators';
import { UserDto } from '../users/dto/user.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.reviewsService.create(createReviewDto, user.id);
  }

  @Get('guide/:guideId')
  async getGuideReviews(@Param('guideId') guideId: string) {
    return await this.reviewsService.findByGuide(guideId);
  }

  @Get('guide/:guideId/rating')
  async getGuideRating(@Param('guideId') guideId: string) {
    const average = await this.reviewsService.getAverageRating(guideId);
    return { guideId, averageRating: average };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.reviewsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.reviewsService.update(id, updateReviewDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: UserDto) {
    await this.reviewsService.remove(id, user.id);
    return { message: 'Review deleted successfully' };
  }
}
