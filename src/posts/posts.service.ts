import { Injectable } from '@nestjs/common';
import { PostsRepository } from './repository/posts.repository';
import { User } from 'src/users/schemas/user.schema';
import { PostRequestDto } from './dto/post.request.dto';

@Injectable()
export class PostsService {
  constructor(private readonly postRepository: PostsRepository) {}

  async getAllPosts() {
    const allPosts = await this.postRepository.getAllPosts();
    return allPosts;
  }

  async createPost(
    data: PostRequestDto,
    image: Express.Multer.File,
    user: User,
  ) {
    const fileName = `posts/${image.filename}`;
    const newPost = {
      ...data,
      postImage: fileName,
      author: user.nickname,
    };
    const post = await this.postRepository.createPost(newPost);
    return post;
  }
}
//이미지 가져올 때는 파일인데, 저장할 때는 문자열이야.
