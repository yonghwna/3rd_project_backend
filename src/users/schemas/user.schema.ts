import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Document, SchemaOptions, Types } from 'mongoose';

const options: SchemaOptions = {
  collection: 'users',
  timestamps: true,
};
@Schema(options)
export class User extends Document {
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'email',
    required: true,
  })
  @Prop({ required: true, unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'exampleName1',
    description: 'nickname',
    required: true,
  })
  @Prop({ required: true, unique: true })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({
    example: 'ExamplePassword1',
    description: '대문자나 소문자, 숫자, 특수문자를 포함한 8자 이상의 비밀번호',
    required: true,
  })
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  // @MinLength(8)
  // @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
  //   message: 'Password too weak',
  // })
  password: string;

  @Prop({
    //회원가입 시 기본이미지 지정.
    default:
      'https://img1.daumcdn.net/thumb/R1280x0/?fname=http://t1.daumcdn.net/brunch/service/user/7r5X/image/9djEiPBPMLu_IvCYyvRPwmZkM1g.jpg',
  })
  @IsString()
  profileImage: string;

  @Prop({ type: [Types.ObjectId], ref: 'Post', default: [] }) // 사용자 게시글 ID 배열
  myPosts: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Post', default: [] }) // 좋아요한 게시글 ID 배열
  bookMarkedPosts: Types.ObjectId[];

  readonly readOnlyData: {
    id: string;
    email: string;
    nickname: string;
    profileImage: string;
    myPosts: Types.ObjectId[];
    bookMarkedPosts: Types.ObjectId[];
  };
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('readOnlyData').get(function (this: User) {
  return {
    id: this.id,
    email: this.email,
    nickname: this.nickname,
    profileImage: this.profileImage,
    myPosts: this.myPosts,
    bookMarkedPosts: this.bookMarkedPosts,
  };
});
//이건 가상필드인데, db에 저장되지 않는다. 가입을 할 때 createdUser를 리턴하면 비밀번호도 보여버리니까,
//가상필드를 만들어서 보여줘도 상관없는 데이터만 보내는거.
//스키마에 추가해서 사용한다.
