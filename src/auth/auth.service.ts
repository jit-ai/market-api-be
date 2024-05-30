import { Body, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TemplateTypes } from 'src/common/helpers/mail/enums/template.code.enum';
import { MailService } from 'src/common/helpers/mail/mail.service';
import { IMail } from 'src/common/model/interface/IMail';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/users/dto/request/create-user.dto';
import { Messages } from 'src/common/constants/messages';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
const moment = require('moment');

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compareSync(password, user.password))) {
      const { password: hashedPassword, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: LoginDto) {
    let data = await this.validateUser(user.email, user.password);
    if (data) {
      let payload = { email: data.email, sub: data.id };

      const user = await this.usersRepository.createQueryBuilder('user')
        .where({
          id: data.id,
          email: data.email
        })
        .getOne();

      delete user.password;

      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.Login.Authorised}`,
        data: { access_token: this.jwtService.sign(payload), ...user },
      };

    } else {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        message: `${Messages.AuthModule.NotMatch}`,
      };
    }
  }
}
