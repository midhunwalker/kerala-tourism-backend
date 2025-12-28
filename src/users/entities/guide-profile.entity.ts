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
import { User } from './user.entity';
import { Tour } from '../../tours/entities/tour.entity';

@Entity('guide_profiles')
export class GuideProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  userId: string;

  @ManyToOne(() => User, user => user.guideProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'text' })
  bio: string;

  @Column({ type: 'simple-array' })
  languages: string[];

  @Column({ type: 'simple-array', nullable: true })
  districts?: string[]; // Kochi, Wayanad, Idukki, etc.

  @Column({ type: 'integer', nullable: true })
  pricePerDay?: number;

  @Column({ type: 'integer', nullable: true })
  experience?: number; // years of experience

  @Column({ type: 'boolean', default: false })
  isApproved: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Tour, tour => tour.guide, { nullable: true })
  tours?: Tour[];
}
