import { PartialType } from '@nestjs/mapped-types';
import { CreateGuideProfileDto } from './create-guide-profile.dto';

export class UpdateGuideProfileDto extends PartialType(CreateGuideProfileDto) {}
