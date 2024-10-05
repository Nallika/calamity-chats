import express from 'express';

import { getUserIdFromToken } from '../components/user/userModel';

/**
 * Middlerware run in routes.
 * Check token, close connection with error if token invalid.
 * If token valid provide user data further to call stack.
 */
export const verifyToken =(req:express.Request, res:express.Response, next: express.NextFunction) => {
  try {
    const token = req.headers['authorization'] as string;
    const userId = getUserIdFromToken(token);

    if (!token || !userId) {
      return res.status(403).send('Unauthorized');
    }

    res.locals.userId = userId;
  } catch (err) {
    console.error('verifyToken: Error on authorization attempt', err);

    return res.status(401).send('Error on authorization attempt');
  }

  return next();
};