import { makeAutoObservable } from "mobx";
import { Post } from "../models/post";
import { PostService } from "../services/PostService";

export class PostsStore {
  posts: Post[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  *createPost(textMessage: string) {
    const post: Post = yield PostService.createPost(textMessage);

    this.posts = [...this.posts, post];
  }

  *updatePost(postId: number, textBody: string) {
    yield PostService.updatePost(postId, textBody);
  }

  *getPosts(skip: number) {
    const response: Post[] = yield PostService.getSelectedPosts(
      `?take=5&skip=${skip}`
    );

    this.posts.push(...response);
  }

  *refreshPosts() {
    const posts: Post[] = yield PostService.getSelectedPosts(
      `?take=5&skip=${0}`
    );

    this.posts = posts;
  }
}
