'use client';

import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

import MessagesStore from '../store/MessagesStore';
import { ChatContextValue } from '../types';
import { connectChat, formatMessageForSocket, getChatId, getChatModeByPath } from '../utils';
import { ChatManager } from '../socket/ChatManager';

export const ChatContext = createContext<ChatContextValue>({
  messages: [],
  sendMessage: () => {},
  connected: false,
  loading: false,
  error: false
});

/**
 * Chat context store and provide messages state and send message handler
 * Also maitain connection state and run re-connect if it neccessary
 */
export const ChatContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [error, setIsError] = useState(false);

  const path = usePathname();
  const chatId = getChatId();
  const mode = getChatModeByPath(path);

  const messagesStore = useMemo(() => MessagesStore.createInstance(chatId), [chatId]);
  const chatManager = useMemo(() => ChatManager.createInstance({chatId, mode, setConnected}), [chatId, mode]);

  /**
   * Send request to re-comment, if attempt failed set error state
   */
  const reConnectChat = useCallback(async () => {
    const {connected: connectedResponse} = await connectChat({chatId, mode});

    if (!connectedResponse) {
      setIsError(true);
      // @todo: add error modal
      console.error('Unable to connect to socket!');
    }
  }, [chatId, mode]);

  useEffect(() => {
    // @todo Here bug, need to make another way to sen connected and loading state
    if (connected) {
      setLoading(false);
    }
  }, [connected]);

  useEffect(() => {
    // If chat wasn't initialized in this session we should send re-conect request
    if (!messagesStore.isInitialized) {
      reConnectChat();
      messagesStore.setIsInitialized();
    }

    // Init socket connection
    chatManager.subscribeToMessages(messagesStore.addMessage);

    return () => {
      // Clear connection on unmount
      chatManager.cleanup();
    };
  }, [chatManager, messagesStore, reConnectChat]);

  /**
   * Format message send to socker and store it
   */
  const sendMessage = useCallback((message: string) => {
    const socketMessage = formatMessageForSocket(message);
    messagesStore.addMessage(socketMessage);
    chatManager.sendSocketMessage(socketMessage);
  }, [chatManager, messagesStore]);

  return (
    <ChatContext.Provider value={{
        messages: messagesStore.messages,
        sendMessage,
        connected,
        loading,
        error
      }}>
      {children}
    </ChatContext.Provider>
  );
};