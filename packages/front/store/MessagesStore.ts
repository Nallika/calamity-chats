import { makeAutoObservable, observable, action } from 'mobx';

import { StorredMessage, SocketMessage } from '../types';
import { formatMessageForStorring,  } from '../utils';

/**
 * Storring chat messages, add new one
 */
class MessagesStore {
  messages: StorredMessage[] = [];

  constructor() {

    makeAutoObservable(this, {
      messages: observable,
      addMessage: action,
    });
  }

  /**
   * Add message from socket to store
   */
  addMessage = (message: SocketMessage) => {
    const formattedMessage = formatMessageForStorring(message);
    this.messages.push(formattedMessage);
  }
}

const messagesStore = new MessagesStore();

export { messagesStore };