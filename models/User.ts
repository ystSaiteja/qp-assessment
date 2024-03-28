// models/User.ts
export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  role: "Admin" | "User";
}
