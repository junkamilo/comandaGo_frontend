import { apiClient } from "@/lib/api-client";
import type { AuthResponse, LoginRequest } from "@/features/auth/types/auth.types";

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/login", data, { auth: false });
  if (!response.data) {
    throw new Error("Respuesta de login sin datos");
  }
  return response.data;
}
