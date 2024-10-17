import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { PositiveIntPipe } from 'src/pipes/positiveint.pipe';
import { NotFloatPipe } from 'src/pipes/NotFloat.pipe';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { UserRequestDto } from './dto/users.request.dto';

@Controller('users')
@UseInterceptors(SuccessInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getCurrentUser() {}

  @Post()
  async signUp(@Body() body: UserRequestDto) {
    return await this.usersService.signUp(body);
  }

  @Post('login')
  logIn() {}

  @Post('logout')
  logOut() {}

  @Post('upload/users')
  uploadUsers() {}
}
