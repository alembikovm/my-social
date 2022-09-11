export type FriendRequest_Status =
  | 'not-sent'
  | 'pending'
  | 'accepted'
  | 'status'
  | 'waiting-for-current-user-response';

export interface FriendRequestStatus {
  status?: FriendRequest_Status;
}

export interface User {
  id?: number;
  creator?: User;
  receiver?: User;
  status?: FriendRequest_Status;
}
