import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { Place } from '../../places/entities/place.entity';
import { Tour } from '../../tours/entities/tour.entity';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 500 })
  url: string;

  @Column({ type: 'uuid', nullable: true })
  placeId: string;

  @Column({ type: 'uuid', nullable: true })
  tourId: string;

  @ManyToOne(() => Place, (place) => place.images, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'placeId' })
  place?: Place;

  @ManyToOne(() => Tour, (tour) => tour.images, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'tourId' })
  tour?: Tour;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
