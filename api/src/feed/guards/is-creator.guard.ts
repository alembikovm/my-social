import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from 'src/auth/models/user.enum';
import { UserService } from 'src/auth/services/user.service';
import { FeedService } from '../services/feed.service';

@Injectable()
export class IsCreatorGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private feedService: FeedService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user, params }: { user: User; params: { id: number } } = request;

    if (!user || !params) return false;

    const userId = user.id;
    const feedId = params.id;

    const currentUser = await this.userService.findUser(userId);
    const currentFeedPost = await this.feedService.findPostById(feedId);

    const isAuthor = currentUser.id === currentFeedPost?.author;

    return isAuthor;
  }
}
