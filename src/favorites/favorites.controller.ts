import { Controller, Post, Delete, Get, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UserDto } from '../users/dto/user.dto';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  async addFavorite(@CurrentUser() user: UserDto, @Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoritesService.addFavorite(user.id, createFavoriteDto);
  }

  @Delete(':placeId')
  async removeFavorite(@CurrentUser() user: UserDto, @Param('placeId') placeId: string) {
    await this.favoritesService.removeFavorite(user.id, placeId);
  }

  @Get()
  async getUserFavorites(@CurrentUser() user: UserDto) {
    return this.favoritesService.getUserFavorites(user.id);
  }

  @Get('check/:placeId')
  async isFavorited(@CurrentUser() user: UserDto, @Param('placeId') placeId: string) {
    const isFav = await this.favoritesService.isFavorited(user.id, placeId);
    return { isFavorited: isFav };
  }
}
