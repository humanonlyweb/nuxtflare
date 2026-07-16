export interface SessionUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
}

declare module "#auth-utils" {
  interface User extends SessionUser {}
}
