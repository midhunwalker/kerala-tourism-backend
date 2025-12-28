import { IsString, IsOptional, IsArray, IsNumber, IsInt, IsBoolean, Min } from 'class-validator';

export class CreateGuideProfileDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  districts?: string[]; // Kochi, Wayanad, Idukki, etc.

  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerDay?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  experience?: number; // years of experience

  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;
}
