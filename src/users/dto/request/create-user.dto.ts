import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

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

