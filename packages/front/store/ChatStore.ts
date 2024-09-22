import { makeAutoObservable, observable, action } from 'mobx';

import { StorredMessage, SocketMessage, AddMessageHandler } from '../types';
import { formatMessageForSocket, formatMessageForStorring,  } from '../utils';

/**
 * Storring chat messages, add new one
 */
export class ChatStore {

  sendSocketMessage: AddMessageHandler;
  messages: StorredMessage[] = [];

  constructor(sendSocketMessage: AddMessageHandler) {
    this.sendSocketMessage = sendSocketMessage;

    makeAutoObservable(this, {
      messages: observable,
      sendMessage: action,
    });
  }

  /**
   * Add user message to store and send it trough socket
   */
  sendMessage = (message: string)  => {
    const socketMessage = formatMessageForSocket(message);
    const storredMessage = formatMessageForStorring(socketMessage);

    this.messages.push(storredMessage);
    this.sendSocketMessage(socketMessage);
  }

  /**
   * Add message from socket to store
   */
  addMessage = (message: SocketMessage) => {
    const formattedMessage = formatMessageForStorring(message);
    this.messages.push(formattedMessage);
  }
}