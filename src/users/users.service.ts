import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRequestDto } from './dto/users.request.dto';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './repository/users.repository';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}
  async getAllUser() {
    const allUser = await this.userRepository.getAllUser();
    const readOnlyData = allUser.map((user) => user.readOnlyData);
    return readOnlyData;
  }

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

  async getUserById(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpException('유저가 존재하지 않습니다', 404);
    }
    return user.readOnlyData;
  }

  async updateUserById(user: User, body: { nickname: string }) {
    console.log({ user: user.id, body });
    const { nickname } = body;
    const newUser = await this.userRepository.findByIdAndUpdateNickname(
      user.id,
      nickname,
    );
    return newUser;
  }

  async uploadImage(user: User, image: Express.Multer.File) {
    const fileName = `users/${image.filename}`;
    const newUser = await this.userRepository.findByIdAndUpdateImg(
      user.id,
      fileName,
    );
    return newUser;
  }

  async deleteUserById(user: User) {
    const deletedUser = await this.userRepository.deleteUserById(user.id);
    if (!deletedUser) {
      throw new HttpException('유저가 존재하지 않습니다', 404);
    }
  }
}
