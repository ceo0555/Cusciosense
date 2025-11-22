import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { User } from '../user/entities/user.entity'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { password, ...userData } = registerDto

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const user = this.userRepository.create({
      ...userData,
      passwordHash,
      roleId: this.getRoleId(registerDto.role),
    })

    await this.userRepository.save(user)

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(user)

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password)

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // Update last login
    user.lastLoginAt = new Date()
    await this.userRepository.save(user)

    const { accessToken, refreshToken } = await this.generateTokens(user)

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['school'],
    })

    if (!user) {
      return null
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

    if (!isPasswordValid) {
      return null
    }

    return user
  }

  async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: this.getRoleSlug(user.roleId),
    }

    const accessToken = this.jwtService.sign(payload)
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' })

    return { accessToken, refreshToken }
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken)
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
        relations: ['school'],
      })

      if (!user) {
        throw new UnauthorizedException('User not found')
      }

      const tokens = await this.generateTokens(user)
      return tokens
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token')
    }
  }

  private sanitizeUser(user: User) {
    const { passwordHash, ...sanitized } = user
    return {
      ...sanitized,
      role: this.getRoleSlug(user.roleId),
    }
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

  private getRoleSlug(roleId: number): string {
    const roles = {
      1: 'super_admin',
      2: 'school_admin',
      3: 'teacher',
      4: 'student',
      5: 'parent',
    }
    return roles[roleId] || 'parent'
  }
}
