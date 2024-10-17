import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRequestDto } from './dto/users.request.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  //   async create(createCatDto: CreateCatDto): Promise<Cat> {
  //     const createdCat = new this.catModel(createCatDto);
  //     return createdCat.save();
  //   }

  async signUp(body: UserRequestDto) {
    const { email, nickname, password } = body;
    const isUserExist = await this.userModel.exists({ email });
    if (isUserExist) {
      throw new UnauthorizedException('이미 가입된 이메일입니다');
    }
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const createdUser = new this.userModel({
      email,
      nickname,
      password: hashedPassword,
    });
    createdUser.save();
    return createdUser.readOnlyData;
  }
}
