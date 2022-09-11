import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/models/user.enum';
import { AuthService } from 'src/auth/services/auth.service';
import { connection, executeQuery } from 'src/main';
import { FeedPost } from '../models/post.interface';

@Injectable()
export class FeedService {
  constructor(private authService: AuthService) {}

  async createPost(user: User, feedPost: FeedPost) {
    await executeQuery(`INSERT INTO feed_post (body, author, createdAt)
    VALUES ("${feedPost.body}", "${user?.id}", NOW())
  `);

    const post = await executeQuery(
      `SELECT
      id, body, createdAt, author
      FROM feed_post 
      WHERE author = '${user?.id}'
      ORDER BY createdAt DESC
      LIMIT 1`,
    );

    const author: User = await this.authService.getUser(user?.id);

    return {
      body: post[0]?.body,
      author: {
        id: author?.id,
        firstName: author?.firstName,
        lastName: author?.lastName,
        email: author?.email,
        role: author?.role,
      },
      id: post[0].id,
      createdAt: post[0]?.createdAt,
    };
  }

  async getAllPosts() {
    return new Promise((res, rej) => {
      connection.execute(`SELECT * FROM feed_post`, (error, results) => {
        if (error) throw error;

        res(results);
      });
    });
  }

  async getSelectedPosts(take = 10, skip = 0) {
    const posts = await executeQuery(`SELECT * FROM feed_post
    ORDER BY createdAt DESC
    LIMIT ${take}
    OFFSET ${skip}
    `);

    return posts;
  }

  // async findPosts(take = 10, skip = 0) {
  //   return new Promise((res, rej) => {
  //     connection.execute(
  //       `SELECT * FROM feed_post
  //     LIMIT ${take}
  //     OFFSET ${skip}
  //     `,
  //       (error, results) => {
  //         if (error) throw error;

  //         res(results);
  //       },
  //     );
  //   });
  // }

  async findPostById(id: number) {
    const post = await executeQuery(
      `SELECT
      id, body, createdAt, author
      FROM feed_post 
      WHERE id = '${id}'
      ORDER BY createdAt DESC
      LIMIT 1`,
    );

    console.log(post[0]);

    return post[0];
  }

  async updatePost(id: number, feedPost: FeedPost) {
    console.log({ id, feedPost });

    return new Promise((res, rej) => {
      connection.execute(
        `UPDATE feed_post SET body='${feedPost.body}' WHERE id=${id}`,
        (error, results) => {
          if (error) throw error;

          res(results);
        },
      );
    });
  }

  async deletePost(id: number) {
    return new Promise((res, rej) => {
      connection.execute(
        `DELETE FROM feed_post WHERE id=${id}`,
        (error, results) => {
          if (error) throw error;

          res(results);
        },
      );
    });
  }
}
