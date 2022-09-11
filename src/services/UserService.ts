import { ServiceBase } from "./BaseService";

export class UserService extends ServiceBase {
  protected static BASE_URL = "/user";

  static async getUserImage(params: any): Promise<any> {
    const { data } = await this.get("/image" + params, null, {
      headers: {
        authorization: localStorage.getItem("token")
          ? `Bearer ${localStorage.getItem("token")}`
          : "",
      },
    });

    return data;
  }

  static async getUserImageName(imageName: any): Promise<any> {
    const { data } = await this.get("/image-name" + imageName, null, {
      headers: {
        authorization: localStorage.getItem("token")
          ? `Bearer ${localStorage.getItem("token")}`
          : "",
      },
    });

    return data;
  }

  static async uploadUserImage(modifiedFieldName: string): Promise<any> {
    console.log({ modifiedFieldName });

    await this.post("/upload", modifiedFieldName, {
      headers: {
        authorization: localStorage.getItem("token")
          ? `Bearer ${localStorage.getItem("token")}`
          : "",
      },
    });
  }
}
