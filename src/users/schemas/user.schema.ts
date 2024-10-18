import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Document, SchemaOptions } from 'mongoose';

const options: SchemaOptions = {
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
    description: 'password',
    required: true,
  })
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Prop()
  @IsString()
  profileImage: string;

  readonly readOnlyData: {
    id: string;
    email: string;
    nickname: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('readOnlyData').get(function (this: User) {
  return {
    id: this.id,
    email: this.email,
    nickname: this.nickname,
  };
});
//이건 가상필드인데, db에 저장되지 않는다. 가입을 할 때 createdUser를 리턴하면 비밀번호도 보여버리니까,
//가상필드를 만들어서 보여줘도 상관없는 데이터만 보내는거.
//스키마에 추가해서 사용한다.
