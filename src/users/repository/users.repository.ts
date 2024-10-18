import { Injectable } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserRequestDto } from '../dto/users.request.dto';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async existsByEmail(email: string): Promise<boolean> {
    const result = await this.userModel.exists({ email });
    return result ? true : false;
  }
  async createUser(user: UserRequestDto): Promise<User> {
    const createdUser = new this.userModel(user);
    createdUser.save();
    return createdUser;
  }
}
