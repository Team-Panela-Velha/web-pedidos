import type { AuthProvider } from "@refinedev/core";
import { authService } from "@/services/auth/authService";
import { apiService } from "@/services/apiService";
import type { UserResponse } from "@/types/user/userTypes";
import { TOKEN_KEY } from "./constants";

const IDENTITY_KEY = "refine-identity";

function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(IDENTITY_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await authService.login({ email, password });
      sessionStorage.setItem(TOKEN_KEY, response.token);
      sessionStorage.setItem(IDENTITY_KEY, JSON.stringify({
        id: response.id, name: response.name, email: response.email, role: response.role,
      }));
      return { success: true, redirectTo: "/" };
    } catch (error) {
      clearSession();
      const status = (error as { status?: number }).status;
      return { success: false, error: {
        name: "LoginError",
        message: status === 401 ? "E-mail ou senha inválidos." : "Não foi possível entrar. Tente novamente.",
      } };
    }
  },
  logout: async () => {
    try {
      if (sessionStorage.getItem(TOKEN_KEY)) await authService.logout();
    } catch {
      // Local logout still succeeds when the server is unavailable.
    } finally {
      clearSession();
    }
    return { success: true, redirectTo: "/login" };
  },
  check: async () => {
    if (!sessionStorage.getItem(TOKEN_KEY)) return { authenticated: false, redirectTo: "/login" };
    try {
      const user = await apiService.get<UserResponse>("/auth/me");
      sessionStorage.setItem(IDENTITY_KEY, JSON.stringify(user));
      return { authenticated: true };
    } catch (error) {
      const status = (error as { status?: number }).status;
      if (status === 401 || status === 403) {
        clearSession();
        return { authenticated: false, redirectTo: "/login" };
      }
      return { authenticated: true };
    }
  },
  getPermissions: async () => {
    const identity = sessionStorage.getItem(IDENTITY_KEY);
    return identity ? JSON.parse(identity).role : null;
  },
  getIdentity: async () => {
    const identity = sessionStorage.getItem(IDENTITY_KEY);
    return identity ? JSON.parse(identity) : null;
  },
  onError: async (error) => {
    const status = (error as { status?: number; response?: { status?: number } }).status
      ?? (error as { response?: { status?: number } }).response?.status;
    if (status === 401) {
      clearSession();
      return { logout: true, redirectTo: "/login", error };
    }
    if (status === 403) {
      return { error: { name: "Forbidden", message: "Você não tem permissão para esta operação." } };
    }
    return { error };
  },
};
