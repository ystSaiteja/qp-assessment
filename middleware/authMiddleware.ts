// authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../auth";

export enum UserRole {
  Admin = "Admin",
  User = "User",
}

export const authMiddleware = (role: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Get token from headers
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token not provided" });
    }

    // Verify token
    try {
      const decodedToken: any = verifyToken(token);
      if (decodedToken.role !== role) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient privileges" });
      }
      // Type assertion to inform TypeScript that decodedToken exists on req
      (req as any).decodedToken = decodedToken;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  };
};
