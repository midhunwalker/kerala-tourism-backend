import {
  IsString,
  IsNumber,
  IsInt,
  IsOptional,
  IsUUID,
  IsEnum,
  Min,
  Max
} from 'class-validator';
import { PlaceCategory } from '../entities/place-category.enum';

export class CreatePlaceDto {
  @IsString()
  name: string;

  @IsUUID()
  districtId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsEnum(PlaceCategory)
  category: PlaceCategory;

  @IsOptional()
  @IsString()
  bestSeason?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  entryFee?: number;
}

export class UpdatePlaceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsEnum(PlaceCategory)
  category?: PlaceCategory;

  @IsOptional()
  @IsString()
  bestSeason?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  entryFee?: number;
}
