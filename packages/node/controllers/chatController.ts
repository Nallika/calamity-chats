import express from 'express';
import { body, validationResult } from 'express-validator';

import { getOrRetreiveUser } from '../components/user/userModel';
import { verifyToken } from './verifyTokenMiddleware';
import { createChatManager, getChatManager } from '../components/chatManager/chatStorage';


/**
 * Init user, create chat and add bots to chat.
 */
export const initializeChat = [
  body('selectedBots', 'At least one bot must be selected').not().isEmpty(),

  async (req:express.Request, res:express.Response) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    // @ts-ignore  @todo: for dev mode
    const io = req.io;
    const token = req.headers['authorization'] as string;
    const {mode, selectedBots} = req.body;

    const user = await getOrRetreiveUser(token);

    if (user) {
      const {id, token} = user;

      const chatManager = createChatManager(io, id);
      const chatId = chatManager.setUpChat(selectedBots, mode);
      const connected = chatManager.connectToChat(chatId, mode);
  
      if (connected) {
        return res.status(200).json({ token, chatId });
      }
    }
      
    return res.status(500).json({ error: 'Unable to init chat' });
  }
];

/**
 * 
 */
export const connectChat = [
  verifyToken,

  body('chatId', 'Chat id must be provided').isString().not().isEmpty().trim().escape(),

  (req:express.Request, res:express.Response) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const { userId } = res.locals;
    const { chatId, mode } = req.body;

    const chatManager = getChatManager(userId);

    if (!chatManager) {
      return res.status(500).json({ error: 'Unable to start chat' });
    }

    const connected = chatManager.connectToChat(chatId, mode);

    if (connected) {
      return res.status(200).json({ connected });
    }

    return res.status(500).json({ error: 'Unable to start chat' });
  }
];
