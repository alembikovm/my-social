import { ServiceBase } from "./BaseService";
import { User } from "../models/user";
import { NewUser } from "../models/newUser";

export class AuthService extends ServiceBase {
  protected static BASE_URL = "/auth";

  static async register(newUser: NewUser): Promise<any> {
    const response = await this.post("/register", newUser, {
      headers: { "Content-Type": "application/json" },
    });

    return response;
  }

  static async login(email: string, password: string): Promise<any> {
    const response: { data: { token: string } } = await this.post(
      "/login",
      { email, password },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    localStorage.setItem("token", response.data?.token);

    return response.data;
  }

  static logout(): void {
    localStorage.removeItem("token");
  }
}
