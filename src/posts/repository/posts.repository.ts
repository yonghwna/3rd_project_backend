import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../schemas/post.schema';
import { PostSaveDao } from '../dto/post.save.dao';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}
  async getAllPosts() {
    return await this.postModel.find();
  }
  async createPost(post: PostSaveDao): Promise<Post> {
    const createdPost = new this.postModel({
      ...post,
      postImage: `http://localhost:8000/media/${post.postImage}`,
    });
    createdPost.save();
    return createdPost;
  }

  //   async findByIdAndUpdateImg(id: string, fileName: string) {
  //     const user = await this.userModel.findById(id);
  //     user.profileImage = `http://localhost:8000/media/${fileName}`;
  //     const newUser = await user.save();
  //     return newUser.readOnlyData;
  //   }
  //   async existsByEmail(email: string): Promise<boolean> {
  //     const result = await this.userModel.exists({ email });
  //     return result ? true : false;
  //   }
  //   async createUser(user: UserRequestDto): Promise<User> {
  //     const createdUser = new this.userModel(user);
  //     createdUser.save();
  //     return createdUser;
  //   }
  //   async findUserByEmail(email: string): Promise<User | null> {
  //     const user = await this.userModel.findOne({ email });
  //     return user;
  //   }
  //   async findUserByIdWithoutPassword(userId: string): Promise<User | null> {
  //     const user = await this.userModel.findById(userId).select('-password');
  //     return user;
  //   }
}
