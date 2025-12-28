import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Place } from './entities/place.entity';
import { CreatePlaceDto, UpdatePlaceDto } from './dto/create-place.dto';

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>
  ) {}

  async create(createPlaceDto: CreatePlaceDto): Promise<Place> {
    const place = this.placeRepository.create(createPlaceDto);
    return this.placeRepository.save(place);
  }

  async findAll(filters?: { district?: string; category?: string }): Promise<Place[]> {
    const query = this.placeRepository.createQueryBuilder('place');

    if (filters?.district) {
      query.innerJoin('place.district', 'district')
        .andWhere('district.name = :district', { district: filters.district });
    }

    if (filters?.category) {
      query.andWhere('place.category = :category', { category: filters.category });
    }

    return query.leftJoinAndSelect('place.district', 'district')
      .leftJoinAndSelect('place.images', 'images')
      .orderBy('place.name', 'ASC')
      .getMany();
  }

  async findById(id: string): Promise<Place> {
    const place = await this.placeRepository.findOne({
      where: { id },
      relations: ['district', 'images', 'reviews']
    });

    if (!place) {
      throw new NotFoundException(`Place with ID ${id} not found`);
    }

    return place;
  }

  async findByDistrict(districtId: string): Promise<Place[]> {
    return this.placeRepository.find({
      where: { districtId },
      relations: ['images'],
      order: { name: 'ASC' }
    });
  }

  async update(id: string, updatePlaceDto: UpdatePlaceDto): Promise<Place> {
    const place = await this.findById(id);
    Object.assign(place, updatePlaceDto);
    return this.placeRepository.save(place);
  }

  async remove(id: string): Promise<void> {
    const place = await this.findById(id);
    await this.placeRepository.remove(place);
  }
}
