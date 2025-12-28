import { IsString, IsDateString, IsNumber, IsInt, IsOptional, IsEnum } from 'class-validator';
import { BookingStatus } from '../entities/booking.entity';

export class CreateBookingDto {
  @IsString()
  tourId: string;

  @IsDateString()
  startDate: string;

  @IsInt()
  people: number;

  @IsNumber()
  totalCost: number;
}

export class UpdateBookingDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsInt()
  people?: number;

  @IsOptional()
  @IsNumber()
  totalCost?: number;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}
