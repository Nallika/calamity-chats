import { Server } from 'socket.io';

import { ChatManager } from './ChatManager';


// @TODO maybe use cache ?
// Map for active user intances
const chatInstances = new Map();

// Pick instance from map to prevent multiple chat instances for single user
export const getOrCreateChatManager = (io: Server, userId: string): ChatManager => {

  if (!chatInstances.has(userId)) {
    chatInstances.set(userId, new ChatManager(io, userId));
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