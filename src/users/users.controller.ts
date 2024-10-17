import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { PositiveIntPipe } from 'src/pipes/positiveint.pipe';
import { NotFloatPipe } from 'src/pipes/NotFloat.pipe';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';

@Controller('users')
@UseInterceptors(SuccessInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUser() {
    return { users: 'get all user api' };
    // throw new HttpException('api is not ready', HttpStatus.FORBIDDEN);
    // return this.usersService.getAllUser();
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe, PositiveIntPipe) param) {
    console.log(param);
    return { users: 'get one user api' };
  }

  // @Post()
  // createUser(@Body() body: any) {
  //   return this.usersService.createUser(body);
  // }

  // @Put(':id')
  // updateUser(@Param('id') id: string, @Body() body: any) {
  //   return this.usersService.updateUser(id, body);
  // }

  // @Patch(':id')
  // updateUserPartial(@Param('id') id: string, @Body() body: any) {
  //   return this.usersService.updateUserPartial(id, body);
  // }

  // @Delete(':id')
  // deleteUser(@Param('id') id: string) {
  //   return this.usersService.deleteUser(id);
  // }
}
