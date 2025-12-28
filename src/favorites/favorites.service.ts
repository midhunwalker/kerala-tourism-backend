import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>
  ) {}

  async addFavorite(userId: string, createFavoriteDto: CreateFavoriteDto): Promise<Favorite> {
    // Check if already favorited
    const existing = await this.favoriteRepository.findOne({
      where: { userId, placeId: createFavoriteDto.placeId }
    });

    if (existing) {
      return existing;
    }

    const favorite = this.favoriteRepository.create({
      userId,
      placeId: createFavoriteDto.placeId
    });
    return this.favoriteRepository.save(favorite);
  }

  async removeFavorite(userId: string, placeId: string): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { userId, placeId }
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    await this.favoriteRepository.remove(favorite);
  }

  async getUserFavorites(userId: string): Promise<Favorite[]> {
    return this.favoriteRepository.find({
      where: { userId },
      relations: ['place', 'place.district'],
      order: { createdAt: 'DESC' }
    });
  }

  async isFavorited(userId: string, placeId: string): Promise<boolean> {
    const favorite = await this.favoriteRepository.findOne({
      where: { userId, placeId }
    });
    return !!favorite;
  }
}
