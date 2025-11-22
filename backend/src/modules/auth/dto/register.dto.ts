import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator'

export class RegisterDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: '+911234567890', required: false })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string

  @ApiProperty({ example: 'parent', enum: ['parent', 'teacher', 'student'] })
  @IsEnum(['super_admin', 'school_admin', 'teacher', 'student', 'parent'])
  role: string

  @ApiProperty({ example: 'uuid', required: false })
  @IsOptional()
  @IsString()
  schoolId?: string
}
