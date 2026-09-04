import Config from "@/config";


export interface RequestOptions extends RequestInit {
  params?: Record<
    string,
    string | number | boolean | null | undefined
  >;
}

class ApiService {
  private readonly baseUrl: string;
  private readonly defaultOptions: RequestInit;

  constructor() {
    this.baseUrl = Config.api.baseUrl;
    this.defaultOptions = {};
  }

  private buildUrl(
    path: string,
    params?: RequestOptions["params"],
  ): string {
    const url = new URL(path, this.baseUrl);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    const {
      params,
      headers,
      body: optionsBody,
      ...requestOptions
    } = options;

    const url = this.buildUrl(path, params);

    const requestBody = body !== undefined
      ? body
      : optionsBody;

    const serializedBody =
      requestBody !== undefined &&
      requestBody !== null &&
      typeof requestBody !== "string" &&
      !(requestBody instanceof FormData) &&
      !(requestBody instanceof Blob) &&
      !(requestBody instanceof ArrayBuffer)
        ? JSON.stringify(requestBody)
        : requestBody as BodyInit | null | undefined;

    const response = await fetch(url, {
      ...this.defaultOptions,
      ...requestOptions,
      method,
      headers: {
        "Content-Type": "application/json",
        ...this.defaultOptions.headers,
        ...headers,
      },
      body: serializedBody,
    });

    if (!response.ok) {
      throw new ApiError(
        `Request failed with status ${response.status}`,
        response.status,
        response,
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      return response.json() as Promise<T>;
    }

    return response.text() as Promise<T>;
  }

  async get<T>(
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>(
      "GET",
      path,
      undefined,
      options,
    );
  }

  async post<TResponse, TBody = unknown>(
    path: string,
    body?: TBody,
    options: RequestOptions = {},
  ): Promise<TResponse> {
    return this.request<TResponse>(
      "POST",
      path,
      body,
      options,
    );
  }

  async put<TResponse, TBody = unknown>(
    path: string,
    body?: TBody,
    options: RequestOptions = {},
  ): Promise<TResponse> {
    return this.request<TResponse>(
      "PUT",
      path,
      body,
      options,
    );
  }

  async patch<TResponse, TBody = unknown>(
    path: string,
    body?: TBody,
    options: RequestOptions = {},
  ): Promise<TResponse> {
    return this.request<TResponse>(
      "PATCH",
      path,
      body,
      options,
    );
  }

  async delete<T>(
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>(
      "DELETE",
      path,
      undefined,
      options,
    );
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly response: Response,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const apiService = new ApiService();