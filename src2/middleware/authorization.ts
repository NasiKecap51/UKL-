import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { SECRET } from "../global";

interface JwtPayload {
  id: string;
  username: string;
  password: string;
  role: string;
}

// Middleware to verify JWT token
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // Check if the authorization header exists and extract the token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ message: "Access Denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const secretKey = SECRET || ""; // Fallback to an empty string if SECRET is undefined
    const decoded = verify(token, secretKey) as JwtPayload;
    req.body.user = decoded; // Attach the decoded token payload to the request body
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

// Middleware to verify user roles
export const verifyRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = req.body.user; // Memeriksa apakah user ada di dalam body permintaan
  
      if (!user) {
        return res.status(403).json({ message: 'User tidak terdaftar. No user information available.' });
      }
  
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          message: `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}`
        });
      }
  
      next(); // Lanjutkan ke route handler
    };
  };
  
