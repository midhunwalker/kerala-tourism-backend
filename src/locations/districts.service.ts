import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { District } from './entities/district.entity';
import { CreateDistrictDto, UpdateDistrictDto } from './dto/create-district.dto';

@Injectable()
export class DistrictsService {
  constructor(
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>
  ) {}

  async create(createDistrictDto: CreateDistrictDto): Promise<District> {
    const district = this.districtRepository.create(createDistrictDto);
    return this.districtRepository.save(district);
  }

  async findAll(): Promise<District[]> {
    return this.districtRepository.find({
      relations: ['places'],
      order: { name: 'ASC' }
    });
  }

  async findById(id: string): Promise<District> {
    const district = await this.districtRepository.findOne({
      where: { id },
      relations: ['places']
    });

    if (!district) {
      throw new NotFoundException(`District with ID ${id} not found`);
    }

    return district;
  }

  async update(id: string, updateDistrictDto: UpdateDistrictDto): Promise<District> {
    const district = await this.findById(id);
    Object.assign(district, updateDistrictDto);
    return this.districtRepository.save(district);
  }

  async remove(id: string): Promise<void> {
    const district = await this.findById(id);
    await this.districtRepository.remove(district);
  }
}
