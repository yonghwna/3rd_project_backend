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
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { PositiveIntPipe } from 'src/pipes/positiveint.pipe';
import { NotFloatPipe } from 'src/pipes/NotFloat.pipe';
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

@Controller('users')
@UseInterceptors(SuccessInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '현재 로그인한 유저 정보' })
  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentUser(@CurrentUser() user) {
    return user.readOnlyData;
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
  @Post()
  async signUp(@Body() body: UserRequestDto) {
    return await this.usersService.signUp(body);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@Body() data: LoginRequestDto) {
    return this.authService.jwtLogIn(data);
  }

  @ApiOperation({ summary: '프로필  이미지 업로드' })
  @Post('upload')
  @UseInterceptors(FileInterceptor('image', multerOptions('users')))
  @UseGuards(JwtAuthGuard)
  uploadUsers(
    @UploadedFile() image: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    return this.usersService.uploadImage(user, image);
  }

  @ApiOperation({ summary: '모든유저' })
  @Get('all')
  async findAll() {
    return await this.usersService.getAllUser();
  }
}
