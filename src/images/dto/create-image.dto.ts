import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateImageDto {
  @IsString()
  url: string;

  @IsOptional()
  @IsUUID()
  placeId?: string;

  @IsOptional()
  @IsUUID()
  tourId?: string;
}

export class UpdateImageDto {
  @IsOptional()
  @IsString()
  url?: string;
}
