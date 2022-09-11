import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  timeout: 300000,
  headers: {
    Accept: "application/json",
    // "Content-Type": "application/json",
  },
  baseURL: "http://localhost:3000/",
  withCredentials: true,
});

const errorHandler = <T = unknown>(
  axiosPromise: AxiosPromise<T>
  // eslint-disable-next-line consistent-return
): AxiosPromise<T> => {
  try {
    return axiosPromise;
  } catch (error) {
    throw error;
  }
};

export abstract class ServiceBase {
  protected static BASE_URL: string = "http://localhost:3000";
  protected static api = axiosInstance;

  public static buildUrl(url: string): string {
    return `${this.BASE_URL}${url}`;
  }

  constructor(private http: Promise<any>) {}

  protected static get<T>(
    url: string,
    data?: unknown,
    options?: AxiosRequestConfig
  ): AxiosPromise<T> {
    let newUrl: string = url;

    const promise = this.api.get(this.buildUrl(newUrl), options);

    return errorHandler(promise);
  }

  protected static post<T>(
    url: string,
    data?: T | any,
    options?: AxiosRequestConfig
  ): AxiosPromise<T> {
    const promise = this.api.post(this.buildUrl(url), data, options);

    return errorHandler(promise);
  }

  protected static put<T>(
    url: string,
    data?: T | any,
    options?: AxiosRequestConfig
  ): AxiosPromise<T> {
    const promise = this.api.put(this.buildUrl(url), data, options);

    return errorHandler(promise);
  }

  protected static delete<T>(
    url: string,
    data?: T | any,
    options?: AxiosRequestConfig
  ): AxiosPromise<T> {
    const promise = this.api.delete(this.buildUrl(url), options);

    return errorHandler(promise);
  }
}
