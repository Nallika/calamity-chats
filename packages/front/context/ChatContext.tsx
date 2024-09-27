'use client';

import React, { createContext, useCallback, useEffect, useState } from 'react';
import { messagesStore } from '../store/MessagesStore';
import { SocketManager } from '../socket/SocketManager';
import { ChatContextValue } from '../types';
import { connectChat, formatMessageForSocket, getChatId } from '../utils';

export const ChatContext = createContext<ChatContextValue>({
  messages: [],
  sendMessage: () => {},
  connected: false,
  loading: false,
  error: false
});

/**
 * Provide messages from store and send message handler
 */
export const ChatContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [error, setIsError] = useState(false);

  // Create socketManager instance
  const socketManager = SocketManager.getInstance({
    chatId: getChatId(),
    setConnected
  });

  // Attmept to re-connect if still not connected after 2 seconds
  useEffect(() => {
    if (connected) {
      setLoading(false);
    }

    const checkConnectTimeout = setTimeout(() => {
      if (!connected) {
        attmeptToReConnect();
      }
    }, 2000);

    return () => {
      clearTimeout(checkConnectTimeout);
    }
  }, [connected]);

  useEffect(() => {
    // Init socket connection
    socketManager.subscribeToMessages(messagesStore.addMessage);

    return () => {
      // Clear connection on unmount
      socketManager.cleanup();
    };
  }, [socketManager]);

  /**
   * Send request to re-comment, if attempt failed set error state
   */
  const attmeptToReConnect = useCallback(async () => {
    const {connected: connectedResponse} = await connectChat(getChatId());
    setConnected(connectedResponse);
    setLoading(false);

    if (!connectedResponse) {
      setIsError(true);
      console.error('Unable to connect to socket!');
    }
  }, []);

  /**
   * Format message send to socker and store it
   */
  const sendMessage = useCallback((message: string) => {
    const socketMessage = formatMessageForSocket(message);
    messagesStore.addMessage(socketMessage);
    socketManager.sendSocketMessage(socketMessage);
  }, [socketManager]);

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