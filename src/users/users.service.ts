import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRequestDto } from './dto/users.request.dto';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './repository/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async signUp(body: UserRequestDto) {
    const { email, password } = body;
    const isUserExist = await this.userRepository.existsByEmail(email);
    if (isUserExist) {
      throw new UnauthorizedException('이미 가입된 이메일입니다');
    }
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const createdUser = await this.userRepository.createUser({
      ...body,
      password: hashedPassword,
    });
    return createdUser.readOnlyData;
  }
}
