import { Module } from '@nestjs/common';
import { FeedService } from './services/feed.service';
import { FeedController } from './controllers/feed.controller';

import { AuthModule } from 'src/auth/auth.module';
import { IsCreatorGuard } from './guards/is-creator.guard';
import { UserService } from 'src/auth/services/user.service';

@Module({
  providers: [FeedService, IsCreatorGuard, UserService],
  controllers: [FeedController],
  imports: [AuthModule],
})
export class FeedModule {}
