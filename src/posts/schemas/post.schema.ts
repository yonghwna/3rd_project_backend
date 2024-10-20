import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Date, Document, SchemaOptions } from 'mongoose';

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

  @Prop({ required: false })
  @IsString()
  postImage: string;
  //   @Prop({
  //     //회원가입 시 기본이미지 지정.
  //     default:
  //       'https://img1.daumcdn.net/thumb/R1280x0/?fname=http://t1.daumcdn.net/brunch/service/user/7r5X/image/9djEiPBPMLu_IvCYyvRPwmZkM1g.jpg',
  //   })
  //   @IsString()
  //   profileImage: string;

  // readonly readOnlyData: {
  //   id: string;
  //   email: string;
  //   nickname: string;
  //   profileImage: string;
  // };
}

export const PostSchema = SchemaFactory.createForClass(Post);

// PostSchema.virtual('readOnlyData').get(function (this: Post) {
//   return {
//     id: this.id,
//     email: this.email,
//     nickname: this.nickname,
//     profileImage: this.profileImage,
//   };
// });
