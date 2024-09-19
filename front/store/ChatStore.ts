import { makeAutoObservable, observable, action } from 'mobx';

import { StorredMessage, SocketMessage } from '@/front/types';
import { formatMessageForSocket, formatMessageForStorring,  } from '@/front/utils';
import { SocketManager } from '@/front/socket/SocketManager';

/**
 * Storring chat messages, add new one
 */
export class ChatStore {

  socketManager: SocketManager;
  messages: StorredMessage[] = [];

  constructor(socketManager: SocketManager) {
    this.socketManager = socketManager;

    makeAutoObservable(this, {
      messages: observable,
      sendMessage: action,
    });

    this.socketManager.subscribeToMessages(this.addMessage);
  }

  /**
   * Add user message to store and send it trough socket
   */
  sendMessage = (message: string)  => {
    const socketMessage = formatMessageForSocket(message);
    const storredMessage = formatMessageForStorring(socketMessage);

    this.messages.push(storredMessage);
    this.socketManager.sendMessage(socketMessage);
  }

  /**
   * Add message from socket to store
   */
  addMessage = (message: SocketMessage) => {
    const formattedMessage = formatMessageForStorring(message);
    this.messages.push(formattedMessage);
  }
}