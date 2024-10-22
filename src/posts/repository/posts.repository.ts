import { Injectable, UnauthorizedException } from '@nestjs/common';

import mongoose, { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../schemas/post.schema';
import { PostSaveDao } from '../dto/post.save.dao';
import { Comments, CommentsSchema } from 'src/comments/schemas/comments.schema';
import { User } from 'src/users/schemas/user.schema';
import { PostRequestDto } from '../dto/post.request.dto';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Comments.name) private commentsModel: Model<Comments>,
  ) {}
  async getAllPosts() {
    const CommentsModel = mongoose.model('comments', CommentsSchema);
    const result = await this.postModel.find();
    // .populate('comments', this.commentsModel);

    return result;
  }

  async getPostById(postId: string | Types.ObjectId) {
    return await this.postModel.findById(postId);
  }
  async createPost(post: PostSaveDao): Promise<Post> {
    const createdPost = new this.postModel({
      ...post,
      postImage: post.postImage ? post.postImage : '',
    });
    createdPost.save();
    return createdPost;
  }
  async getPostByCategory(category: string) {
    return await this.postModel.find({ category });
  }

  async updatePost(
    post: Omit<PostRequestDto, 'category' | 'postImage'>,
    id: string,
    fileName: string,
  ) {
    const existPost = await this.postModel.findById(id);
    existPost.title = post.title;
    existPost.content = post.content;
    existPost.quote = post.quote;
    existPost.postImage = fileName !== '' ? fileName : existPost.postImage;
    const updatedPost = await existPost.save();
    return updatedPost;
  }

  async deletePostById(user: User, postId: string) {
    // const post = await this.postModel.findById(postId);
    // if (post.authorId.toString() !== user.id) {
    //   throw new UnauthorizedException('해당 게시글을 삭제할 권한이 없습니다.');
    // }
    await this.postModel.findByIdAndDelete(postId);
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
