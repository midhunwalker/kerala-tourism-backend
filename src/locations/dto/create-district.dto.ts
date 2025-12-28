import { IsString, IsOptional } from 'class-validator';

export class CreateDistrictDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  state?: string;
}

export class UpdateDistrictDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  state?: string;
}
