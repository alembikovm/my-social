import { Injectable } from '@nestjs/common';
import { of } from 'rxjs';
import { executeQuery } from 'src/main';
import { FriendRequest } from '../models/friend-request.entity';
import {
  FriendRequestStatus,
  FriendRequest_Status,
} from '../models/friend-request.interface';
import { User } from '../models/user.interface';

@Injectable()
export class UserService {
  async findUser(id) {
    const user = await executeQuery(
      `SELECT
          id, firstName, lastName, email
          FROM user 
          WHERE id="${id}" 
          LIMIT 1`,
    );

    return user[0];
  }

  async updateUserImageById(id: number, imageName: string): Promise<void> {
    await executeQuery(
      `UPDATE user
           SET id="${id}", imageName="${imageName}"
           WHERE id="${id}"`,
    );
  }

  async findUserImageById(id: number): Promise<User> {
    const imageName = await executeQuery(
      `SELECT imageName
            FROM user 
            WHERE id="${id}" 
            LIMIT 1`,
    );

    return imageName[0];
  }

  async hasRequestBeenSentOrReceived(creatorId, receiverId): Promise<boolean> {
    const request = await executeQuery(
      `SELECT *
            FROM request 
            WHERE( creatorId="${creatorId}" AND receiverId="${receiverId}") 
            OR (creatorId="${receiverId}" AND receiverId="${creatorId}")
            LIMIT 1`,
    );

    if (!request[0]) return false;
    return true;
  }

  async sendFriendRequest(
    receiverId: number,
    creator: User,
  ): Promise<FriendRequest | { error: string }> {
    if (receiverId === creator.id) {
      return { error: "It's not posible to add yourself" };
    }

    const receiver = await this.findUser(receiverId);

    if (
      (await this.hasRequestBeenSentOrReceived(creator.id, receiverId)) === true
    )
      return {
        error:
          'A friend request has already been sent of received to your account!',
      };

    const friendRequest: FriendRequest = {
      creator,
      receiver,
      status: 'pending',
    };

    await executeQuery(`INSERT INTO request (creatorId, receiverId, status)
    VALUES ("${friendRequest.creator.id}", "${friendRequest.receiver.id}", "${friendRequest.status}")`);

    return friendRequest;
  }

  async getFriendRequestStatus(
    receiverId: number,
    currentUser: User,
  ): Promise<FriendRequestStatus> {
    const receiver: User = await this.findUser(receiverId);
    const friendRequest: FriendRequest = await executeQuery(`SELECT *
      FROM request
      WHERE (creatorId="${currentUser.id}" AND receiverId="${receiver.id}")
      OR
      (creatorId="${receiver.id}" AND receiverId="${currentUser.id}")
    `);

    if (friendRequest[0]?.receiver.id === currentUser.id) {
      return { status: 'waiting-for-current-user-response' };
    }

    return { status: friendRequest[0]?.status || 'not-sent' };
  }

  async getFriendRequestUserById(
    friendRequestId: number,
  ): Promise<FriendRequest> {
    const currentFriendRequest = await executeQuery(`SELECT * FROM request 
    WHERE id="${friendRequestId}"`);

    return currentFriendRequest[0];
  }

  async respondToFriendRequest(
    statusResponse: FriendRequest_Status,
    friendRequestId: number,
  ): Promise<FriendRequestStatus | { error: string }> {
    const friendRequestUser: FriendRequest =
      await this.getFriendRequestUserById(friendRequestId);

    if (friendRequestUser) {
      console.log({ friendRequestUser });

      await executeQuery(
        `UPDATE request
          SET status="${statusResponse}"
          WHERE id="${friendRequestId}"
          `,
      );

      return { ...friendRequestUser, status: statusResponse };
    }

    return { error: "Current request doesn't exist" };
  }

  async getFriendRequestsFromRecepients(currentUser: User): Promise<any> {
    const friendRequestsFromRecepients = await executeQuery(
      `SELECT * FROM request WHERE receiverId="${currentUser?.id}"`,
    );

    console.log({ friendRequestsFromRecepients });

    return friendRequestsFromRecepients;
  }
}
