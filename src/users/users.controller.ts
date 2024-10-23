import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { UserRequestDto } from './dto/users.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReadOnlyUserDto } from './dto/user.dto';
import { AuthService } from 'src/auth/auth.service';
import { LoginRequestDto } from 'src/auth/dto/login.request.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils/multer.options';
import { User } from './schemas/user.schema';
import { memoryStorage } from 'multer';

@Controller('users')
@UseInterceptors(SuccessInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '현재 로그인한 유저 정보' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getCurrentUser(@CurrentUser() user) {
    return user.readOnlyData;
  }

  @ApiOperation({ summary: 'id로 유저정보 가져오기' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.usersService.getUserById(id);
  }

  @ApiOperation({ summary: '로그인한 유저 정보 수정' })
  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateUserById(@CurrentUser() user, @Body() body) {
    return await this.usersService.updateUserById(user, body);
  }

  @ApiResponse({
    status: 500,
    description: 'server error',
  })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: ReadOnlyUserDto,
  })
  @ApiOperation({ summary: '회원가입' })
  @Post('signup')
  async signUp(@Body() body: UserRequestDto) {
    return await this.usersService.signUp(body);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('signin')
  logIn(@Body() data: LoginRequestDto) {
    return this.authService.signIn(data);
  }

  //이미지가 없다면 여기서 커트를해야지
  @ApiOperation({ summary: '프로필  이미지 업로드' })
  @Patch('upload')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  //users라는 폴더에 이미지 저장
  @UseGuards(JwtAuthGuard)
  //유저정보 가져오기
  uploadUsers(
    @UploadedFile() image: Express.Multer.File | undefined,
    @CurrentUser() user: User,
  ) {
    if (image === undefined) {
      throw new BadRequestException(
        'Image upload failed. No image file provided.',
      );
    }
    //로그인한 유저 정보와 이미지를 전달.
    return this.usersService.uploadImage(user, image);
  }

  @ApiOperation({ summary: '로그인한 유저 계정 삭제' })
  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteUserById(@CurrentUser() user) {
    this.usersService.deleteUserById(user);
  }
}
