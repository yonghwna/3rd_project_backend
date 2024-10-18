import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../schemas/user.schema';

export class ReadOnlyUserDto extends PickType(User, [
  'email',
  'nickname',
] as const) {
  @ApiProperty({
    example: '671147b18983a22fd49b03fe',
    description: 'id',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  id: string;
}
