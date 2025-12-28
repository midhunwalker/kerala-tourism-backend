import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto, UpdateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: string): Promise<Booking> {
    const booking = this.bookingRepository.create({
      ...createBookingDto,
      userId,
    });
    return await this.bookingRepository.save(booking);
  }

  async findAll(userId?: string): Promise<Booking[]> {
    if (userId) {
      return await this.bookingRepository.find({
        where: { userId },
        relations: ['user', 'tour'],
      });
    }
    return await this.bookingRepository.find({
      relations: ['user', 'tour'],
    });
  }

  async findById(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user', 'tour'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto,
    userId: string,
  ): Promise<Booking> {
    const booking = await this.findById(id);

    if (booking.userId !== userId) {
      throw new ForbiddenException('You can only update your own bookings');
    }

    Object.assign(booking, updateBookingDto);
    return await this.bookingRepository.save(booking);
  }

  async cancel(id: string, userId: string): Promise<Booking> {
    const booking = await this.findById(id);

    if (booking.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own bookings');
    }

    booking.status = BookingStatus.CANCELLED;
    return await this.bookingRepository.save(booking);
  }

  async remove(id: string, userId: string): Promise<void> {
    const booking = await this.findById(id);

    if (booking.userId !== userId) {
      throw new ForbiddenException('You can only delete your own bookings');
    }

    await this.bookingRepository.remove(booking);
  }
}
