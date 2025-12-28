import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { GuideProfile } from '../../users/entities/guide-profile.entity';
import { Place } from '../../places/entities/place.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid', nullable: true })
  guideId: string;

  @Column({ type: 'uuid', nullable: true })
  placeId: string;

  @ManyToOne(() => User, user => user.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => GuideProfile, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'guideId' })
  guide?: GuideProfile;

  @ManyToOne(() => Place, place => place.reviews, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'placeId' })
  place?: Place;

  @Column({ type: 'integer', default: 5 })
  rating: number; // 1-5 stars

  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
