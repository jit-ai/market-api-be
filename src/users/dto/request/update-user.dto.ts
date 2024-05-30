import { IsEmail, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  firstName?: string;

  @ApiProperty()
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @IsOptional()
  userName?: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  password?: string;

  @ApiProperty()
  @IsOptional()
  phone?: number;

  @ApiProperty()
  @IsOptional()
  gender?: string;

  @ApiProperty()
  @IsOptional()
  address?: string;

  @ApiProperty()
  @IsOptional()
  zipCode?: string;

  @ApiProperty()
  @IsOptional()
  category?: string;

  @ApiProperty()
  @IsOptional()
  age?: number;
}
