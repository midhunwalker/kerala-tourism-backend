import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  OneToOne,
  OneToMany
} from 'typeorm';
import { GuideProfile } from './guide-profile.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { Review } from '../../reviews/entities/review.entity';

export enum UserRole {
  USER = 'USER',
  GUIDE = 'GUIDE',
  ADMIN = 'ADMIN'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => GuideProfile, guideProfile => guideProfile.user, { nullable: true })
  guideProfile?: GuideProfile;

  @OneToMany(() => Booking, booking => booking.user, { nullable: true })
  bookings?: Booking[];

  @OneToMany(() => Review, review => review.user, { nullable: true })
  reviews?: Review[];
}