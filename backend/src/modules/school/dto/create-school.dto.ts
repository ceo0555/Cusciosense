import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail, IsOptional, IsNumber } from 'class-validator'

export class CreateSchoolDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  slug: string

  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  phone: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  state?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  country?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  board?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subscriptionPlan?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maxStudents?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maxTeachers?: number
}
