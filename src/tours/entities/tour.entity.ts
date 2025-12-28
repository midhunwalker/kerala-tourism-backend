import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { GuideProfile } from '../../users/entities/guide-profile.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { Image } from '../../images/entities/image.entity';

@Entity('tours')
export class Tour {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  guideId: string;

  @ManyToOne(() => GuideProfile, guide => guide.tours, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'guideId' })
  guide: GuideProfile;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'integer' })
  duration: number; // days

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'integer' })
  maxPeople: number;

  @Column({ type: 'varchar', length: 255 })
  location: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Booking, booking => booking.tour, { nullable: true })
  bookings?: Booking[];

  @OneToMany(() => Image, image => image.tour, { nullable: true })
  images?: Image[];
}
