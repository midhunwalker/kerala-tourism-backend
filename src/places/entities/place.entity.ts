import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { District } from '../../locations/entities/district.entity';
import { Image } from '../../images/entities/image.entity';
import { Review } from '../../reviews/entities/review.entity';
import { PlaceCategory } from './place-category.enum';

@Entity('places')
export class Place {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'uuid' })
  districtId: string;

  @ManyToOne(() => District, (district) => district.places, { onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'districtId' })
  district: District;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  longitude: number;

  @Column({
    type: 'enum',
    enum: PlaceCategory,
    default: PlaceCategory.HERITAGE,
  })
  category: PlaceCategory;

  @Column({ type: 'varchar', length: 100, nullable: true })
  bestSeason: string; // Oct–Mar

  @Column({ type: 'integer', nullable: true })
  entryFee: number; // in INR

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Image, (image) => image.place, { nullable: true })
  images?: Image[];

  @OneToMany(() => Review, (review) => review.place, { nullable: true })
  reviews?: Review[];
}
