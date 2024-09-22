'use client';

import React, { createContext, FC, useEffect } from 'react';
import { ChatStore } from '../store/ChatStore';
import { SocketManager } from '../socket/SocketManager';

type ChatContextProviderProps = {children: React.ReactNode, socketManager: SocketManager}

export const ChatContext = createContext<Partial<ChatStore>>({});

export const ChatContextProvider: FC<ChatContextProviderProps> = ({ children, socketManager }) => {
  const store = new ChatStore(socketManager.sendSocketMessage);

  useEffect(() => {
    // Create scoket connection
    socketManager.subscribeToMessages(store.addMessage);

    // Unsubscribe from socket
    return () => {
      socketManager.cleanup();
    };
  }, [socketManager, store.addMessage]);

  return (
    <ChatContext.Provider value={store}>
      {children}
    </ChatContext.Provider>
  );
};