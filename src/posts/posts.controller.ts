import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthService } from 'src/auth/auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/schemas/user.schema';
import { PostRequestDto } from './dto/post.request.dto';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { multerOptions } from 'src/common/utils/multer.options';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
@UseInterceptors(SuccessInterceptor)
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly authService: AuthService,
  ) {}
  @ApiOperation({ summary: '모든 포스트 가져오기' })
  //   @UseGuards(JwtAuthGuard)
  @Get('all')
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @ApiOperation({ summary: '포스트 생성하기' })
  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions('posts')))
  @UseGuards(JwtAuthGuard)
  createPost(
    @UploadedFile() image: Express.Multer.File,
    @Body() data: PostRequestDto,
    @CurrentUser() user: User,
  ) {
    return this.postsService.createPost(data, image, user);
  }
}
