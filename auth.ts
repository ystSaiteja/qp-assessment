// auth.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;
const secretKey = "your_secret_key";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

export async function comparePasswords(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export function generateToken(payload: any): string {
  return jwt.sign(payload, secretKey);
}

export function verifyToken(token: string): any {
  return jwt.verify(token, secretKey);
}
