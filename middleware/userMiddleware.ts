// adminMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { authMiddleware, UserRole } from "./authMiddleware";

export const userMiddleware = authMiddleware(UserRole.User);
