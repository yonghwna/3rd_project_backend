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
    example: '6719bd69cf2a692f1ed23e35',
    description: '포스트 id',
    required: true,
  })
  _id: string;

  @ApiProperty({
    example: '2024-09-01T00:00:00.000Z',
    description: '포스트 작성일',
    default: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-09-01T00:00:00.000Z',
    description: '포스트 수정일',
    default: new Date(),
  })
  updatedAt: Date;

  @ApiProperty({
    example: '도서',
    description: 'category',
    required: true,
  })
  @Prop({ required: true, default: '전체' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    example: '꿈꾸는 책들의 도시',
    description: 'title',
    required: true,
  })
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '오름과 지혜 그 사이',
    description: 'content',
    required: true,
  })
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: '여기서부터 이야기는 시작된다',
    description: 'quote',
    required: true,
  })
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  quote: string;

  @ApiProperty({
    example: 'exampleName1',
    description: '작성자 닉네임',
    required: true,
  })
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({
    example: 'asdfq23saf21asdfa4',
    description: '작성자 id',
    required: true,
  })
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  authorId: string;

  @ApiProperty({
    example: 'image.jpg',
    description: '포스트 이미지 주소',
    required: false,
  })
  @Prop()
  @IsString()
  postImage: string;

  @ApiProperty({
    example: [
      '6719bd69cf2a692f1ed23e35',
      '6719bd69cf2a692f1ed23e35',
      '6719bd69cf2a692f1ed23e35',
    ],
    description: '좋아요 누른 유저 id',
    required: false,
  })
  @Prop({
    type: [Types.ObjectId],
    ref: 'users',
    required: true,
    default: [],
  })
  bookMarked: { userId: Types.ObjectId }[];
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
_PostSchema.virtual('comments', {
  ref: 'comments',
  localField: '_id',
  foreignField: 'info',
});
_PostSchema.set('toObject', { virtuals: true });
_PostSchema.set('toJSON', { virtuals: true });

export const PostSchema = _PostSchema;
