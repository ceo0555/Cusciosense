import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(query: any) {
    const { page = 1, limit = 20, role, schoolId, search } = query

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.school', 'school')

    if (role) {
      const roleId = this.getRoleId(role)
      queryBuilder.andWhere('user.roleId = :roleId', { roleId })
    }

    if (schoolId) {
      queryBuilder.andWhere('user.schoolId = :schoolId', { schoolId })
    }

    if (search) {
      queryBuilder.andWhere(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` },
      )
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()

    return {
      data,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['school'],
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async update(id: string, updateData: Partial<User>) {
    const user = await this.findOne(id)
    Object.assign(user, updateData)
    return this.userRepository.save(user)
  }

  async remove(id: string) {
    const user = await this.findOne(id)
    await this.userRepository.softRemove(user)
    return { message: 'User deleted successfully' }
  }

  private getRoleId(roleSlug: string): number {
    const roles = {
      super_admin: 1,
      school_admin: 2,
      teacher: 3,
      student: 4,
      parent: 5,
    }
    return roles[roleSlug] || 5
  }
}
