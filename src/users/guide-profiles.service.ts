import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GuideProfile } from './entities/guide-profile.entity';
import { CreateGuideProfileDto } from './dto/create-guide-profile.dto';
import { UpdateGuideProfileDto } from './dto/update-guide-profile.dto';

@Injectable()
export class GuideProfilesService {
  constructor(
    @InjectRepository(GuideProfile)
    private guideProfileRepository: Repository<GuideProfile>,
  ) {}

  async create(createGuideProfileDto: CreateGuideProfileDto): Promise<GuideProfile> {
    const profile = this.guideProfileRepository.create(createGuideProfileDto);
    return await this.guideProfileRepository.save(profile);
  }

  async findAll(): Promise<GuideProfile[]> {
    return await this.guideProfileRepository.find({
      relations: ['user'],
      where: { isApproved: true },
    });
  }

  async findByUserId(userId: string): Promise<GuideProfile | null> {
    return await this.guideProfileRepository.findOne({
      where: { userId },
      relations: ['user'],
    });
  }

  async findById(id: string): Promise<GuideProfile> {
    const profile = await this.guideProfileRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Guide profile not found');
    }

    return profile;
  }

  async update(id: string, updateGuideProfileDto: UpdateGuideProfileDto): Promise<GuideProfile> {
    const profile = await this.findById(id);
    Object.assign(profile, updateGuideProfileDto);
    return await this.guideProfileRepository.save(profile);
  }

  async approve(id: string): Promise<GuideProfile> {
    const profile = await this.findById(id);
    profile.isApproved = true;
    return await this.guideProfileRepository.save(profile);
  }

  async remove(id: string): Promise<void> {
    const profile = await this.findById(id);
    await this.guideProfileRepository.remove(profile);
  }
}
