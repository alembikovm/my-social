import { FriendRequest_Status } from './friend-request.interface';
import { UserEntity } from './user.entity';
import { User } from './user.enum';

export interface FriendRequestEntity {
  id: number;
  creator?: UserEntity;
  status?: FriendRequest_Status;
  receiverId?: number;
}

export interface FriendRequest {
  id?: number;
  creator?: User;
  receiver?: User;
  status?: FriendRequest_Status;
}
