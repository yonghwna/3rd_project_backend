import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

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
    @InjectModel(User.name) private usersModel: Model<User>,
  ) {}
  //모든 포스트 가져오기
  async getAllPosts() {
    // const CommentsModel = mongoose.model('comments', CommentsSchema);
    // .populate('comments', this.commentsModel);
    const result = await this.postModel.find();

    return result;
  }

  //id로 포스트 가져오기
  async getPostById(postId: string | Types.ObjectId) {
    return await this.postModel.findById(postId);
  }

  //특정 카테고리 포스트 가져오기
  async getPostByCategory(category: string) {
    return await this.postModel.find({ category });
  }

  async getPostByTitle(title: string) {
    return await this.postModel.find({
      title: { $regex: title, $options: 'i' },
    });
  }

  //포스트 생성하기
  async createPost(post: PostSaveDao): Promise<Post> {
    const createdPost = new this.postModel({
      ...post,
      postImage: post.postImage ? post.postImage : '',
    });
    createdPost.save();
    await this.usersModel.findByIdAndUpdate(post.authorId, {
      $push: { myPosts: createdPost._id }, // 새로 생성된 게시글 ID를 사용자 배열에 추가
    });
    return createdPost;
  }

  //포스트 수정하기
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

  //포스트 삭제하기
  async deletePostById(user: User, postId: string) {
    //포스트 검색
    const post = await this.postModel.findById(postId);
    // 좋아요 누른 사용자 ID로 사용자 검색
    const likedUsers = await this.usersModel.find({
      _id: { $in: post.likes.map((like) => like.userId) },
    });
    console.log(likedUsers);
    // 각 사용자의 likedPosts 배열에서 해당 포스트 ID 제거
    for (const likedUser of likedUsers) {
      likedUser.bookMarkedPosts = likedUser.bookMarkedPosts.filter(
        (bookMarkedPost) => bookMarkedPost.toString() !== postId,
      );
      await likedUser.save();
    }
    // 포스트 작성자의 myPosts 배열에서 해당 포스트 삭제
    const author = await this.usersModel.findById(user.id);
    author.myPosts = author.myPosts.filter(
      (myPost) => myPost.toString() !== postId,
    );
    await author.save();

    //포스트 삭제
    await this.postModel.findByIdAndDelete(postId);
  }

  //게시글에 좋아요 추가
  async likePost(postId: string, userId: string) {
    //포스트 정보 가져오기
    const post = await this.postModel.findById(postId);
    //좋아요 눌렀는지 확인하기
    const existUser = post.likes.find(
      (like) => like.userId.toString() === userId,
    );
    const user = await this.usersModel.findById(userId);
    //눌렀으면 취소하기
    if (existUser) {
      post.likes = post.likes.filter(
        (like) => like.userId.toString() !== userId,
      );
      //유저의 좋아요한 게시글 배열에서 해당 게시글 삭제
      user.bookMarkedPosts = user.bookMarkedPosts.filter(
        (bookMarkedPost) => bookMarkedPost.toString() !== postId,
      );

      //안눌렀으면 추가하기
    } else {
      post.likes.push({ userId: new Types.ObjectId(userId) });
      //유저의 좋아요한 게시글 배열에 해당 게시글 추가
      user.bookMarkedPosts.push(new Types.ObjectId(postId));
    }
    //포스트 저장하기
    await post.save();
    await user.save();
    return post;
  }
}
