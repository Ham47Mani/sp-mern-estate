import { NextFunction, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { handleResponseError } from '../utils/handleResponse';
import { HttpStatusCode } from '../utils/httpStatusCodes';
import { JwtPayload } from 'jsonwebtoken';
import { verifyToken } from '../utils/jwtToken';
import { getItem } from '../utils/mongooseCruds';
import userModel from '../models/user.model';
import { CustomRequest } from '../utils/costume.type';

// ======================= Auth Middleware - Check the token from cookie =======================
export const authMiddleware = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies.access_token;// Get the token
  if(!token) {
    handleResponseError(res, HttpStatusCode.UNAUTHORIZED, 'Unauthorized - Missing or invalid token');
    return;
  }
  try {
    // Verify token and check if payload is exists
    const payload: string | JwtPayload = await verifyToken(token);
    if(typeof payload === 'string' || !payload.id) {
      handleResponseError(res, HttpStatusCode.UNAUTHORIZED, 'Unauthorized - Invalid token');
      return;
    }
    // Get user from payload with id
    const user = await getItem(userModel, {_id: payload.id});
    if(!user) {
      handleResponseError(res, HttpStatusCode.NOTFOUND, 'User not found');
      return;
    }
    // Add user to request
    req.user = user;
    next();
  } catch (err: any) {
    if (err === 'Token has expired') {
      handleResponseError(res, HttpStatusCode.UNAUTHORIZED, 'Unauthorized - Token has expired');
    }
    handleResponseError(res, HttpStatusCode.INTERNALSERVERERROR, 'Internal Server Error');
  }
});