import { io, Socket } from "socket.io-client";
import { SOCKET_IN_MESSAGE, SOCKET_OUT_MESSAGE } from '../constants';
import { AddMessageHandler, SocketMessage } from '../types';

/**
 * Handle scoket connection, send / receive messages
 */
export class SocketManager {
  private static instance: SocketManager;
  private socket: Socket;
  private pending: boolean = false;

  private constructor(chatId: string) {
    this.socket = io(`/user-${chatId}`);

    this.socket.on('connect', () => {
      this.pending = false;
    });

    this.socket.on('disconnect', () => {
      this.pending = false;
    });

    this.socket.on('reconnect', () => {
      this.pending = false;
    });
  }

  // Provide a global point of access to the instance
  public static getInstance(chatId?: string): SocketManager {
    if (!SocketManager.instance && chatId) {
      SocketManager.instance = new SocketManager(chatId);
    }
    return SocketManager.instance;
  }

  /**
   * Initialize subscription with provided callaback to store messages
   */
  public subscribeToMessages(addMessage: AddMessageHandler) {
    // Add check on pending connection to avoid multiple subscription
    if (!this.pending) {
      this.socket.on(SOCKET_OUT_MESSAGE, addMessage);
      this.pending = true;
    }
  }

  /**
   * Send already formatted message to server
   */
  public sendSocketMessage = (message: SocketMessage) => {
    this.socket.emit(SOCKET_IN_MESSAGE, message);
  };

  /**
   * Clear connection
   */
  public cleanup() {
    if (this.socket.connected) {
      this.socket.off(SOCKET_OUT_MESSAGE);
      this.socket.disconnect();
    }
  }
}