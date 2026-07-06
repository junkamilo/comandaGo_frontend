import { ApiError } from "@/lib/api-error";
import { getAccessToken } from "@/lib/auth-storage";
import type { ApiResponse, FieldErrorResponse } from "@/lib/types/api-response";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8080/api/v1";

type RequestOptions = {
  body?: unknown;
  auth?: boolean;
};

function buildHeaders(auth: boolean): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (auth) {
    const token = getAccessToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  return headers;
}

function isFieldErrorArray(data: unknown): data is FieldErrorResponse[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item) => item !== null && typeof item === "object" && "field" in item && "message" in item,
    )
  );
}

async function request<T>(
  method: string,
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const { body, auth = true } = options;
  const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const response = await fetch(url, {
    method,
    headers: buildHeaders(auth),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let payload: ApiResponse<T> | null = null;
  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    if (!response.ok) {
      throw new ApiError(response.status, "Error de conexión con el servidor");
    }
    throw new ApiError(response.status, "Respuesta inválida del servidor");
  }

  if (!response.ok) {
    const fieldErrors = isFieldErrorArray(payload?.data) ? payload.data : undefined;
    throw new ApiError(response.status, payload?.message ?? "Error en la solicitud", fieldErrors);
  }

  return payload!;
}

export const apiClient = {
  get<T>(path: string, options?: Omit<RequestOptions, "body">) {
    return request<T>("GET", path, options);
  },
  post<T>(path: string, body?: unknown, options?: Omit<RequestOptions, "body">) {
    return request<T>("POST", path, { ...options, body });
  },
  patch<T>(path: string, body?: unknown, options?: Omit<RequestOptions, "body">) {
    return request<T>("PATCH", path, { ...options, body });
  },
  put<T>(path: string, body?: unknown, options?: Omit<RequestOptions, "body">) {
    return request<T>("PUT", path, { ...options, body });
  },
  delete<T>(path: string, body?: unknown, options?: Omit<RequestOptions, "body">) {
    return request<T>("DELETE", path, { ...options, body });
  },
};
