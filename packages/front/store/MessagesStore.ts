import { makeAutoObservable, observable, action } from 'mobx';

import { StorredMessage, SocketMessage } from '../types';
import { formatMessageForStorring,  } from '../utils';

/**
 * Storring chat messages, add new one
 */
export default class MessagesStore {
  
  private static chatId: string;
  private static instance: MessagesStore;

  public messages: StorredMessage[] = [];
  public isInitialized = false;

  constructor(chatId: string) {
    MessagesStore.chatId = chatId;

    makeAutoObservable(this, {
      messages: observable,
      isInitialized: observable,
      addMessage: action,
      setIsInitialized: action,
    });
  }

  /**
   * Create singleton instance for each new chat, to maintain own history for each uniq chat
   */
  public static createInstance(chatId: string): MessagesStore {
    if (!MessagesStore.instance || MessagesStore.chatId !== chatId) {
      MessagesStore.instance = new MessagesStore(chatId);
    }
    
    return MessagesStore.instance;
  }

  /**
   * Add message from socket to store
   */
  setIsInitialized = () => {
    this.isInitialized = true;
  }

  /**
   * Add message from socket to store
   */
  addMessage = (message: SocketMessage) => {
    const formattedMessage = formatMessageForStorring(message);
    this.messages.push(formattedMessage);
  }
}