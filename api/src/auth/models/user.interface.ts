import { FeedPost } from 'src/feed/models/post.interface';
import { Role } from './role.enum';

export interface User {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  imageName?: string;
  role?: Role;
  posts?: FeedPost[];
}
