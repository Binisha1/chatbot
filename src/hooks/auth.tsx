import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import axios from "axios";
import {
  LoginData,
  RegisterData,
  LoginResponse,
  RegisterResponse,
} from "./types";

const baseUrl = "https://chatapp-fastapi.vercel.app/";

const axiosConfig = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

const apiRoutes = {
  signIn: `/login`,
  register: `/register`,
};

export const useLogin = () => {
  const navigate = useNavigate();

  const loginMutation = useMutation<LoginResponse, Error, LoginData>({
    mutationFn: async (credentials: LoginData) => {
      const formData = new URLSearchParams();
      formData.append("username", credentials.username);
      formData.append("password", credentials.password);

      const { data } = await axiosConfig.post(apiRoutes.signIn, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      return { ...data, username: credentials.username };
    },
    onSuccess: ({ access_token, token_type, username }) => {
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("tokenType", token_type);
      localStorage.setItem("username", username);
      navigate("/chatPage");
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  return {
    login: loginMutation.mutateAsync,
    error: loginMutation.error,
    isSuccess: loginMutation.isSuccess,
  };
};

export const useRegister = () => {
  const navigate = useNavigate();

  const registerMutation = useMutation<RegisterResponse, Error, RegisterData>({
    mutationFn: async (registrationData: RegisterData) => {
      const { data } = await axiosConfig.post(apiRoutes.register, {
        username: registrationData.username,
        password: registrationData.password,
      });
      return data;
    },
    onSuccess: () => {
      navigate("/");
      //   window.location.reload();
    },
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });

  return {
    register: registerMutation.mutateAsync,
    error: registerMutation.error,
    isSuccess: registerMutation.isSuccess,
  };
};

export const useLogout = () => {
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("tokenType");
      localStorage.removeItem("username");
    },
    onSuccess: () => {
      navigate("/");
      window.location.reload();
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });

  return {
    logout: logoutMutation.mutate,

    error: logoutMutation.error,
  };
};
