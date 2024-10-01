import { Server } from 'socket.io';

import { ChatManager } from './ChatManager';


// @TODO maybe use cache ?
// Map for active user intances
const chatInstances = new Map();

export const createChatManager = (io: Server, userId: string): ChatManager => {
  // Maitain only one chat connection per user
  if (chatInstances.has(userId)) {
    removeChatInstance(userId);
  }

  chatInstances.set(userId, new ChatManager(io, userId));

  return chatInstances.get(userId);
}

export const getChatManager = (userId: string): ChatManager | false => {
  if (!chatInstances.has(userId)) {
    console.error(`There is no active chat ssesion for user' ${userId}`);
    return false;
  }

  return chatInstances.get(userId);
}

export const removeChatInstance = (userId: string) => {
  if (chatInstances.has(userId)) {
    chatInstances.delete(userId);
  }
}

// @TODO: TBD
export const  cleanupInactiveChats = () => {
  chatInstances.forEach((chatManager, userId) => {
    if (chatManager.isInactive()) {
      chatManager.cleanup();
      chatInstances.delete(userId);
    }
  });
}