import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TransformDateToEpoch } from 'src/common/helpers/decorators/transformDateToEpoch';

export class UserResponse {
  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  userName: string;

  @Expose()
  email: string;

  @Expose()
  password: string;

  @Expose()
  phone: number;

  @Expose()
  gender: string;

  @Expose()
  address: string;

  @Expose()
  zipCode: string;

  @Expose()
  category: string;

  @Expose()
  age: number;

  @ApiPropertyOptional({ example: Date.now() / 1000 })
  @TransformDateToEpoch()
  @Expose()
  createdDate?: Date;


  @ApiPropertyOptional({ example: Date.now() / 1000 })
  @TransformDateToEpoch()
  @Expose()
  updatedDate?: Date;
}
