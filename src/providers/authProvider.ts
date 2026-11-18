import type { AuthProvider } from "ra-core";

/** The person using the app. There is no login screen. Change the name for the business. */
export const CURRENT_USER = { id: "me", fullName: "Jane Doe", avatar: undefined as string | undefined };

export const authProvider: AuthProvider = {
  login: async () => undefined,
  logout: async () => undefined,
  checkAuth: async () => undefined,
  checkError: async () => undefined,
  getPermissions: async () => undefined,
  getIdentity: async () => CURRENT_USER,
};
