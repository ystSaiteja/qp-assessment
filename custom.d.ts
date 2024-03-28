// custom.d.ts
import { UserRole } from "./middleware/authMiddleware"; // Assuming authMiddleware is defined in authMiddleware.ts

declare global {
  namespace Express {
    interface Request {
      decodedToken?: {
        id: number;
        username: string;
        role: UserRole;
      };
    }
  }
}
