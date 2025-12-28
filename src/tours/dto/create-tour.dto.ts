import {
  IsString,
  IsInt,
  IsNumber,
  IsArray,
  IsUUID,
  Min,
  Max,
  IsOptional
} from 'class-validator';

export class CreateTourDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsInt()
  @Min(1)
  duration: number; // days

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(1)
  maxPeople: number;

  @IsString()
  location: string;

  @IsOptional()
  isActive?: boolean;
}

export class UpdateTourDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxPeople?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  isActive?: boolean;
}
