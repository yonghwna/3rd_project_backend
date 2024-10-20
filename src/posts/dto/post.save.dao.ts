import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Post } from '../schemas/post.schema';

export class PostSaveDao extends PickType(Post, [
  'category',
  'title',
  'content',
  'quote',
  'author',
  'postImage',
] as const) {}
