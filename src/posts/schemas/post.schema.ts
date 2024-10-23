import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Document, SchemaOptions } from 'mongoose';
import { Types } from 'mongoose';
const options: SchemaOptions = {
  timestamps: true,
};
@Schema(options)
export class Post extends Document {
  @ApiProperty({
    example: '책',
    description: 'category',
    required: true,
  })
  @Prop({ required: true, default: '전체' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    example: '해리포터',
    description: 'title',
    required: true,
  })
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '너무 재미있었어요',
    description: 'content',
    required: true,
  })
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: '지금도 재미있을까?',
    description: 'quote',
    required: true,
  })
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  quote: string;

  @ApiProperty({
    example: 'exampleName1',
    description: 'author',
    required: true,
  })
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({
    example: 'asdfq23saf21asdfa4',
    description: 'author',
    required: true,
  })
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  authorId: string;

  @Prop()
  @IsString()
  postImage: string;

  @Prop({
    type: [Types.ObjectId],
    ref: 'users',
    default: [],
  })
  likes: { userId: Types.ObjectId }[];
}

export const _PostSchema = SchemaFactory.createForClass(Post);
//이게 가상필드
// _PostSchema.virtual('readOnlyData').get(function (this: User) {
//   return {
//     id: this.id,
//     email: this.email,
//     nickname: this.nickname,
//     profileImage: this.profileImage,
//   };
// });
//이건 조인기능 구현. comments라는 가상 필드 만들고, 추가하고싶은 내용을 추가하는거.
// _PostSchema.virtual('comments', {
//   ref: 'comments',
//   localField: '_id',
//   foreignField: 'info',
// });
// _PostSchema.set('toObject', { virtuals: true });
// _PostSchema.set('toJSON', { virtuals: true });

export const PostSchema = _PostSchema;
