import jwt from 'jsonwebtoken';

import { addUser, updateUserData } from '../../db/db';
import { Credentials } from '../../types';


/**
 * Generate JWT token by provided user id
 */
const generateToken = (id: string) => jwt.sign({ id, issued: Date.now }, process.env.TOKEN_KEY as string);

/**
 * Save token in db.
 */
const saveToken = async (id: string): Promise<Credentials | false> => {
  const token = generateToken(id);
  const result = await updateUserData(id, {token});

  if (result) {
    return {id, token};
  } else {
    console.error('UserModel: Error when try to update token');

    return false;
  }
}

/**
 * Add user set in db, generate and return auth token.
 */
const createUser = async (): Promise<Credentials | false> => {
  const id = await addUser();

  if (!id) {
    return false;
  }

  return saveToken(id);
}

/**
 * Get user from token if provided, or create new one.
 */
export const getOrRetreiveUser = async (token?: string): Promise<Credentials | false> => {
  if (token) {
    const id = getUserIdFromToken(token);
   
    if (id) {
      return saveToken(id);
    } else {
      console.error('UserModel: Error when try to user from provided token');

      return false;
    }
  }

  return createUser();
}

/**
 * Verify token, return user id from it, or return empty string
 */
export const getUserIdFromToken = (token: string): string => {
  try {
    const { id } = jwt.verify(token, process.env.TOKEN_KEY as string) as {id: string};

    return id;
  } catch (error) {
    console.error('UserModel: Error when try to verify token ', error);

    return '';
  }
}

