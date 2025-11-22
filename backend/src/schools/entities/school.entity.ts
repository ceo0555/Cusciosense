import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ClassEntity } from '../../classes/entities/class.entity';

@Entity('schools')
export class School {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 255, nullable: true })
  website: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 100, nullable: true })
  state: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ length: 20, nullable: true })
  postalCode: string;

  @Column({ length: 100, nullable: true })
  board: string;

  @Column({ length: 100, nullable: true })
  affiliationNumber: string;

  @Column({ nullable: true })
  establishedYear: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 'trial', length: 50 })
  subscriptionStatus: string;

  @Column({ type: 'jsonb', nullable: true })
  settings: any;

  @OneToMany(() => ClassEntity, (classEntity) => classEntity.school)
  classes: ClassEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
