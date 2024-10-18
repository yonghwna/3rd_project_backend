import { Injectable } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserRequestDto } from '../dto/users.request.dto';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async getAllUser() {
    return await this.userModel.find();
  }
  async findByIdAndUpdateImg(id: string, fileName: string) {
    const user = await this.userModel.findById(id);
    user.profileImage = `http://localhost:8000/media/${fileName}`;
    const newUser = await user.save();
    return newUser.readOnlyData;
  }
  async existsByEmail(email: string): Promise<boolean> {
    const result = await this.userModel.exists({ email });
    return result ? true : false;
  }
  async createUser(user: UserRequestDto): Promise<User> {
    const createdUser = new this.userModel(user);
    createdUser.save();
    return createdUser;
  }
  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    return user;
  }
  async findUserByWithoutPassword(userId: string): Promise<User | null> {
    const user = await this.userModel.findById(userId).select('-password');
    return user;
  }
}
