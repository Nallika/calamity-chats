'use client';

import React, { createContext, useCallback, useEffect } from 'react';
import { messagesStore } from '../store/MessagesStore';
import { SocketManager } from '../socket/SocketManager';
import { ChatContextValue } from '../types';
import { formatMessageForSocket, getChatId } from '../utils';

export const ChatContext = createContext<Partial<ChatContextValue>>({});

/**
 * Provide messages from store and send message handler
 */
export const ChatContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {

  useEffect(() => {
    // Init socket connection
    SocketManager.getInstance(getChatId()).subscribeToMessages(messagesStore.addMessage);

    return () => {
      // Clear connection on unmount
      SocketManager.getInstance().cleanup();
    };
  }, []);

  /**
   * Format message send to socker and store it
   */
  const sendMessage = useCallback((message: string) => {
    const socketMessage = formatMessageForSocket(message);
    messagesStore.addMessage(socketMessage);
    SocketManager.getInstance().sendSocketMessage(socketMessage);
  }, []);

  return (
    <ChatContext.Provider value={{messages: messagesStore.messages, sendMessage}}>
      {children}
    </ChatContext.Provider>
  );
};