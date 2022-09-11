import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { IsCreatorGuard } from '../guards/is-creator.guard';

import { FeedPost } from '../models/post.interface';
import { FeedService } from '../services/feed.service';

@Controller('feed_post')
export class FeedController {
  constructor(private feedService: FeedService) {}

  @UseGuards(JwtGuard)
  @Post()
  createPost(@Body() feedPost: FeedPost, @Request() req) {
    return this.feedService.createPost(req.user, feedPost);
  }

  @UseGuards(JwtGuard)
  @Get()
  getSelectedPosts(@Query('take') take = 10, @Query('skip') skip = 0) {
    take = take > 20 ? 20 : take;
    return this.feedService.getSelectedPosts(take, skip);
  }

  @UseGuards(JwtGuard, IsCreatorGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() feedPost: FeedPost) {
    return this.feedService.updatePost(id, feedPost);
  }

  @UseGuards(JwtGuard, IsCreatorGuard)
  @Delete(':id')
  deletePost(@Param('id') id: number) {
    return this.feedService.deletePost(id);
  }

  // findUserById(id: number): Observable<User> {
  //   return from(this.authService.findUser(id)).pipe(
  //     map((user: User) => {
  //       delete user.password;
  //       return user;
  //     }),
  //   );
  // }
}
