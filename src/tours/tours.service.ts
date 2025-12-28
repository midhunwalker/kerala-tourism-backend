import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tour } from './entities/tour.entity';
import { CreateTourDto, UpdateTourDto } from './dto/create-tour.dto';

@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(Tour)
    private readonly tourRepository: Repository<Tour>
  ) {}

  async create(guideId: string, createTourDto: CreateTourDto): Promise<Tour> {
    const tour = this.tourRepository.create({
      guideId,
      ...createTourDto
    });
    return this.tourRepository.save(tour);
  }

  async findAll(filters?: { district?: string; guideId?: string }): Promise<Tour[]> {
    const query = this.tourRepository
      .createQueryBuilder('tour')
      .where('tour.isActive = true');

    if (filters?.district) {
      query.andWhere('tour.district = :district', { district: filters.district });
    }

    if (filters?.guideId) {
      query.andWhere('tour.guideId = :guideId', { guideId: filters.guideId });
    }

    return query.orderBy('tour.createdAt', 'DESC').getMany();
  }

  async findById(id: string): Promise<Tour> {
    const tour = await this.tourRepository.findOne({ where: { id } });
    if (!tour) {
      throw new NotFoundException(`Tour with ID ${id} not found`);
    }
    return tour;
  }

  async findByGuide(guideId: string): Promise<Tour[]> {
    return this.tourRepository.find({
      where: { guideId },
      order: { createdAt: 'DESC' }
    });
  }

  async update(
    id: string,
    guideId: string,
    updateTourDto: UpdateTourDto
  ): Promise<Tour> {
    const tour = await this.findById(id);

    if (tour.guideId !== guideId) {
      throw new ForbiddenException('You can only update your own tours');
    }

    Object.assign(tour, updateTourDto);
    return this.tourRepository.save(tour);
  }

  async deactivate(id: string, guideId: string): Promise<Tour> {
    const tour = await this.findById(id);

    if (tour.guideId !== guideId) {
      throw new ForbiddenException('You can only deactivate your own tours');
    }

    tour.isActive = false;
    return this.tourRepository.save(tour);
  }

  async remove(id: string, guideId: string): Promise<void> {
    const tour = await this.findById(id);

    if (tour.guideId !== guideId) {
      throw new ForbiddenException('You can only delete your own tours');
    }

    await this.tourRepository.remove(tour);
  }
}
