'use client';

import { createContext, FC } from 'react';
import { ChatStore } from './ChatStore';
import { SocketManager } from '@/front/socket/SocketManager';

type ChatStoreProviderProps = {children: React.ReactNode, socketManager: SocketManager}

export const ChatStoreContext = createContext<Partial<ChatStore>>({});

export const ChatStoreProvider: FC<ChatStoreProviderProps> = ({ children, socketManager }) => (
  <ChatStoreContext.Provider value={new ChatStore(socketManager)}>
    {children}
  </ChatStoreContext.Provider>
);