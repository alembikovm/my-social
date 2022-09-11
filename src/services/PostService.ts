import { Post } from "../models/post";
import { ServiceBase } from "./BaseService";

export class PostService extends ServiceBase {
  protected static BASE_URL = "/feed_post";

  static async getSelectedPosts(params: any): Promise<Post[]> {
    const { data } = await this.get("" + params, null, {
      headers: {
        authorization: localStorage.getItem("token")
          ? `Bearer ${localStorage.getItem("token")}`
          : "",
      },
    });

    return data as Post[];
  }

  static async createPost(body: string) {
    const postedMessage = await this.post(
      "",
      { body },
      {
        headers: {
          authorization: localStorage.getItem("token")
            ? `Bearer ${localStorage.getItem("token")}`
            : "",
        },
      }
    );

    console.log({ postedMessage });
  }

  static async updatePost(postId: number, body: string) {
    const updatedMessage = await this.put(
      `/${postId}`,
      { body },
      {
        headers: {
          authorization: localStorage.getItem("token")
            ? `Bearer ${localStorage.getItem("token")}`
            : "",
        },
      }
    );

    console.log({ updatedMessage });
  }

  static async deletePost(postId: number) {
    const deletedMessage = await this.delete(
      `/${postId}`,
      {},
      {
        headers: {
          authorization: localStorage.getItem("token")
            ? `Bearer ${localStorage.getItem("token")}`
            : "",
        },
      }
    );

    console.log({ deletedMessage });
  }
}
