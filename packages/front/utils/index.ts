import { SocketMessage, StorredMessage } from '../types';
import { CHAT_ID_HASH, TOKEN } from '../constants';

export { initNewChat, connectChat } from './requests';

export const formatMessageForStorring = (message: SocketMessage): StorredMessage => {
  // TODO: fix this
  const input = message.sender === 'user';

  return {
    sender: message.sender,
    body: message.body,
    input,
    time: input ? Date.now() : message.time
  }
}


/**
 * Add neccearry fields to send message trough socket
 */
export const formatMessageForSocket = (message: string): SocketMessage => {
  return {
    sender: 'user',
    body: message,
    time: Date.now()
  }
}

export const saveChatId = (chatId: string) => {
  localStorage.setItem(CHAT_ID_HASH, chatId);
}

export const getChatId = () => {
  const chatId = localStorage && localStorage.getItem(CHAT_ID_HASH);

  return chatId || '';
}

export const saveToken = (token: string) => {
  localStorage.setItem(TOKEN, token);
}

export const getToken = () => {
  const token = localStorage && localStorage.getItem(TOKEN);

  return token || '';
}