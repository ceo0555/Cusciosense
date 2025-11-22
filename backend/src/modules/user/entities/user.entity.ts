import { Entity, Column, ManyToOne, OneToOne, OneToMany, JoinColumn } from 'typeorm'
import { BaseEntity } from '@/common/entities/base.entity'
import { School } from '@/modules/school/entities/school.entity'
import { Exclude } from 'class-transformer'

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string

  @Column({ unique: true, nullable: true })
  phone?: string

  @Column({ name: 'password_hash' })
  @Exclude()
  passwordHash: string

  @Column({ name: 'first_name' })
  firstName: string

  @Column({ name: 'last_name' })
  lastName: string

  @Column({ name: 'role_id' })
  roleId: number

  @Column({ name: 'school_id', nullable: true })
  schoolId?: string

  @ManyToOne(() => School, { nullable: true })
  @JoinColumn({ name: 'school_id' })
  school?: School

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl?: string

  @Column({ name: 'is_active', default: true })
  isActive: boolean

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean

  @Column({ name: 'email_verified_at', nullable: true })
  emailVerifiedAt?: Date

  @Column({ name: 'phone_verified_at', nullable: true })
  phoneVerifiedAt?: Date

  @Column({ name: 'last_login_at', nullable: true })
  lastLoginAt?: Date
}
