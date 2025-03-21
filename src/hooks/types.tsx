export interface LoginData {
  username: string;
  password: string;
}
export interface RegisterData {
  username: string;
  password: string;
}
export interface LoginResponse {
  access_token: string;
  token_type: string;
  username: string;
}
export type RegisterResponse = unknown;
