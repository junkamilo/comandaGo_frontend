export type Rol = "ADMIN" | "MESERO" | "COCINERO" | "RECEPCIONISTA" | "CAJERO";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
}
