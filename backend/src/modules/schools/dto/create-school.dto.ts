import { IsString, IsEmail, IsEnum, IsInt, IsOptional } from 'class-validator';

enum Board {
  CBSE = 'CBSE',
  ICSE = 'ICSE',
  STATE = 'STATE',
  IB = 'IB',
  IGCSE = 'IGCSE',
}

export class CreateSchoolDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsString()
  pincode: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsInt()
  establishedYear: number;

  @IsEnum(Board)
  board: Board;
}
