import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


interface newRequest extends Request {
  user?: string | {}; // Replace YourUserType with the type of your decoded JWT payload
}

export function verifyJwt(req: newRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["x-auth-token"];
  if (!authHeader) {
    return res.sendStatus(401); // Unauthorized
  }
  try {
    const decode = jwt.verify(
      authHeader as unknown as string,
      process.env.ACCESS_TOKEN_PRIVATE_KEY!
    );
    req.user = decode;
    next();
  } catch (err) {
    return res.status(403).send('Forbidden'); // Forbidden
  }
}
