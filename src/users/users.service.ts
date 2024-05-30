import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Messages } from 'src/common/constants/messages';
import { NotFoundException } from 'src/common/helpers/exception/NotFoundException';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { updatePasswordDto } from './dto/request/update-password.dto';
import { UserResponse } from './dto/response/users-response';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { MailService } from 'src/common/helpers/mail/mail.service';
import { IMail } from 'src/common/model/interface/IMail';
import { TemplateTypes } from 'src/common/helpers/mail/enums/template.code.enum';
import { IFindAllUsers } from './interface/user.find';
import { ChangePasswordDto } from './dto/request/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private mailService: MailService,
  ) {}

  async create(request: CreateUserDto): Promise<any> {
    
    const existingUserEmail = await this.usersRepository.findOne({
      where: { email: request.email },
    });
    if (existingUserEmail) {
      throw new BadRequestException(`${Messages.Register.AlreadyExist}`);
    }
    if (request.password) {
      await this.checkPasswordValidity(request.password);
      request.password = await bcrypt.hashSync(request.password, 10);
    }
    const result = await this.usersRepository.save(request);


    if (result) {
      delete result.password;
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.UserModule.AccountCreated}`,
        data: result,
      }
    }
    
  }


  async findAll(options: IFindAllUsers): Promise<any> {
    const query = await this.usersRepository.createQueryBuilder('user');
    if (options.search) {
      query.andWhere('user.firstName like :firstName', {
        firstName: `%${options.search}%`,
      });
      query.orWhere('user.lastName like :lastName', {
        lastName: `%${options.search}%`,
      });
      query.orWhere('user.email like :email', {
        email: `%${options.search}%`,
      });
      query.orWhere('user.address like :address', {
        address: `%${options.search}%`,
      });
      query.orWhere('user.phone like :phone', {
        phone: `%${options.search}%`,
      });
    }

    if (options.skip) query.offset(options.skip);

    if (options.limit) query.limit(options.limit);

    if (options.sortColumn) {
      query.orderBy(`user.${options.sortColumn}`, options.sortType);
    }

    const [result, count] = await query.getManyAndCount();
    let sNo:number =0;
    result.map((user) => {
      sNo = sNo + 1; 
      user["sNo"] = sNo;
      delete user.password;
    });
    if (result.length > 0) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.UserModule.UserFound}`,
        totalRows: count,
        data: result,
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.UserModule.UserNotFound}`,
      };
    }
  }

  async findOne(userId: number): Promise<any> {
    try {
      let user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (user) {
        delete user.password;
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.UserModule.UserFound}`,
          data: user,
        };
      } else {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: `${Messages.UserModule.UserNotFound}`,
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.UserModule.UserNotFound}`,
      };
    }
  }

  async update(userId: number, request: UpdateUserDto): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (user) {

      if(request.email) {
        throw new BadRequestException(`${Messages.UserModule.EmailModified}`);
      }

      if (request.password) {
        await this.checkPasswordValidity(request.password);
        request.password = await bcrypt.hashSync(request.password, 10);
      }

      const result = await this.usersRepository.update(userId, request);

      if (!result) {
        throw new NotFoundException(`${Messages.UserModule.UserNotFound}`);
      }

      const updateUser = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (updateUser) {
        delete updateUser.password;
      }
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.UserModule.UserUpdated}`,
        data: updateUser,
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.UserModule.UserNotFound}`,
      };
    }
  }

  async remove(userId: number): Promise<any> {
    const deletedUser = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (deletedUser) {
      await this.usersRepository.delete(userId);
      delete deletedUser.password;
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.UserModule.UserFound}`,
        data: deletedUser,
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.UserModule.UserNotFound}`,
      }
    }
  }

  async customQuery() {
    return this.usersRepository
      .createQueryBuilder('user')
      .select('name')
      .orderBy('name');
  }

  async findByEmail(email: string): Promise<UserResponse> {
    return await this.usersRepository.findOne({ where: { email: email } });
  }

  async updatePassword(updatePasswordDto: updatePasswordDto) {
    try {
      const result = await this.usersRepository.findOne({
        where: {
          id: updatePasswordDto.id,
          email: updatePasswordDto.email,
        },
      });

      if (result) {
        await this.usersRepository.update(result.id, {
          password: await bcrypt.hashSync(updatePasswordDto.password, 10),
        });
        delete result.password;
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.UserModule.PasswordUpdate}`,
          data: result,
        };
      } else {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: `${Messages.UserModule.EmailOrOtpNotExist}`,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async changePassword(changePassword: ChangePasswordDto) {
    const user = await this.usersRepository.findOne({
      where:
        { id: changePassword.userId }
    });
    try {
      if (user) {
        const isMatch = await bcrypt.compare(changePassword.currentPassword, user.password);
        if (isMatch) {
          if(changePassword.newPassword) {
            await this.checkPasswordValidity(changePassword.newPassword);
          }
          if(changePassword.newPassword === changePassword.currentPassword) {
            throw new BadRequestException(`${Messages.UserModule.Password}`);
          }
          await this.usersRepository.update(changePassword.userId, {
            password: await bcrypt.hashSync(changePassword.newPassword, 10),
          })
          return {
            status: HttpStatus.OK,
            message: `${Messages.UserModule.PasswordChanged}`
          }
        }
        throw new BadRequestException(`${Messages.UserModule.PasswordCorrect}`);
      }
      throw new BadRequestException(`${Messages.UserModule.ValidUser}`);
    }
    catch (err) {
      throw (err)
    }
  }

  /**
 * @param {string} value: passwordValue
 */
  async checkPasswordValidity(value) {
    const isValidLength = /^.{8,20}$/;
    if (!isValidLength.test(value)) {
      throw new BadRequestException(`${Messages.UserModule.PasswordLength}`);
    }

    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    if (!isContainsUppercase.test(value)) {
      throw new BadRequestException(`${Messages.UserModule.PasswordUppercase}`);
    }

    const isContainsSymbol =
      /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
    if (!isContainsSymbol.test(value)) {
      throw new BadRequestException(`${Messages.UserModule.PasswordSpecialChars}`);
    }

    return null;
  }
}
