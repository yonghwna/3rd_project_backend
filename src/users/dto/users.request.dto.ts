import { PickType } from '@nestjs/swagger';
import { User } from '../schemas/user.schema';

export class UserRequestDto extends PickType(User, [
  'email',
  'nickname',
  'password',
] as const) {}
