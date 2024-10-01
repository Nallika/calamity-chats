import express from 'express';

import { ChatModeEnum } from 'calamity-chats-types';

import { BOT_NAMES } from '../constants/botConfig';

/**
 * Get data for set up new chat.
 * Called on page load, pre-loaded by Next.
 */
export const getBotsList = (req:express.Request, res:express.Response) => {
  return res.status(200).json({ 
    bots: Object.values(BOT_NAMES),
    modes: Object.values(ChatModeEnum),
  });
};
