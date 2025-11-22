import { Entity, Column } from 'typeorm'
import { BaseEntity } from '@/common/entities/base.entity'

@Entity('schools')
export class School extends BaseEntity {
  @Column()
  name: string

  @Column({ unique: true })
  slug: string

  @Column()
  email: string

  @Column()
  phone: string

  @Column({ nullable: true })
  address?: string

  @Column({ nullable: true })
  city?: string

  @Column({ nullable: true })
  state?: string

  @Column({ default: 'India' })
  country: string

  @Column({ name: 'postal_code', nullable: true })
  postalCode?: string

  @Column({ name: 'logo_url', nullable: true })
  logoUrl?: string

  @Column({ nullable: true })
  website?: string

  @Column({ name: 'established_year', nullable: true })
  establishedYear?: number

  @Column({ nullable: true })
  board?: string

  @Column({ name: 'subscription_status', default: 'trial' })
  subscriptionStatus: string

  @Column({ name: 'subscription_plan', nullable: true })
  subscriptionPlan?: string

  @Column({ name: 'subscription_start_date', type: 'date', nullable: true })
  subscriptionStartDate?: Date

  @Column({ name: 'subscription_end_date', type: 'date', nullable: true })
  subscriptionEndDate?: Date

  @Column({ name: 'max_students', default: 100 })
  maxStudents: number

  @Column({ name: 'max_teachers', default: 10 })
  maxTeachers: number

  @Column({ type: 'jsonb', default: {} })
  settings: Record<string, any>

  @Column({ name: 'is_active', default: true })
  isActive: boolean
}
