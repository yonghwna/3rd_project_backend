import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
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
import { memoryStorage } from 'multer';

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

  @ApiOperation({ summary: 'id로 포스트 가져오기' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.postsService.getPostById(id);
  }

  @ApiOperation({ summary: '특정 카테고리 포스트 가져오기' })
  @UseGuards(JwtAuthGuard)
  @Get('quote/:category')
  getPostByCategory(@Param('category') category: string) {
    return this.postsService.getPostByCategory(category);
  }

  @ApiOperation({ summary: '특정 카테고리 포스트 가져오기' })
  @UseGuards(JwtAuthGuard)
  @Get('title/:title')
  getPostByTitle(@Param('title') title: string) {
    console.log(title);
    return this.postsService.getPostByTitle(title);
  }

  @ApiOperation({ summary: '포스트 생성하기' })
  @Post()
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  @UseGuards(JwtAuthGuard)
  async createPost(
    @Body() data: PostRequestDto,
    @CurrentUser() user: User,
    @UploadedFile() image: Express.Multer.File | undefined,
  ) {
    return this.postsService.createPost(data, user, image);
  }

  @ApiOperation({ summary: '포스트 수정하기' })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @Param('id') id: string,
    @Body() data: PostRequestDto,
    @CurrentUser() user: User,
    @UploadedFile() image: Express.Multer.File | undefined,
  ) {
    console.log({ id, data, user, image });
    return this.postsService.updatePost(id, data, user, image);
  }

  @ApiOperation({ summary: 'id로 게시글 삭제' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteUserById(@CurrentUser() user: User, @Param('id') id: string) {
    this.postsService.deletePostById(user, id);
  }

  // 게시글에 좋아요 추가
  @Post(':postId/like')
  @UseGuards(JwtAuthGuard)
  async likePost(@Param('postId') postId: string, @CurrentUser() user: User) {
    return this.postsService.likePost(postId, user.id);
  }

  // 게시글에 좋아요 취소
  // @Delete(':postId/unlike')
  // async unLikePost(@Param('postId') postId: string, @CurrentUser() user: User) {
  //   return this.postsService.unLikePost(postId, user.id);
  // }
}
