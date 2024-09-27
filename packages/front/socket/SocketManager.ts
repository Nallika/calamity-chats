import { io, Socket } from "socket.io-client";

import { NotificationMessage, NotificationType, SOCKET_MESSAGE } from 'calamity-chats-types';

import { ConnectedToggle, SendMessageHandler, SocketManagerParams, SocketMessage } from '../types';

/**
 * Handle scoket connection, send / receive messages
 */
export class SocketManager {
  private static instance: SocketManager;
  private socket: Socket;
  // Pending connection flag, used to prevent multiple connections
  private pending: boolean = false;
  // Forward connection status callback
  setConnected: ConnectedToggle;

  private constructor({chatId, setConnected}: SocketManagerParams) {
    this.socket = io(`/user-${chatId}`, {
      reconnection: true,
      reconnectionAttempts: 1,
      reconnectionDelay: 1000,
    });
    this.setConnected = setConnected;

    this.socket.on('connect', () => {
      this.pending = false;
      this.sendHandshake();
    });

    this.socket.on('disconnect', () => {
      this.pending = false;
    });

    this.socket.on('reconnect', () => {
      this.pending = false;
    });
  }

  // Provide a global point of access to the instance
  public static getInstance(params?: SocketManagerParams): SocketManager {
    // @TODO: check params
    if (!SocketManager.instance && !!params) {
      SocketManager.instance = new SocketManager(params);
    }
    return SocketManager.instance;
  }

  /**
   * Initialize subscription with provided callaback to store messages
   */
  public subscribeToMessages(addMessage: SendMessageHandler) {
    // Add check on pending connection to avoid multiple subscription
    if (!this.pending) {
      this.socket.on(SOCKET_MESSAGE.MESSAGE, addMessage);
      this.socket.on(SOCKET_MESSAGE.NOTIFICATION, this.onNotification);
      this.pending = true;
    }
  }

  /**
   * Send already formatted message to server
   */
  public sendSocketMessage = (message: SocketMessage) => {
    this.socket.emit(SOCKET_MESSAGE.MESSAGE, message);
  };

  /**
   * Send already formatted message to server
   */
  private sendHandshake = () => {
    this.pending = true;
    this.socket.emit(SOCKET_MESSAGE.NOTIFICATION, {type: NotificationType.HANDSHAKE});
  };

  private onNotification = (messagae: NotificationMessage) => {
    switch (messagae.type) {
      case NotificationType.HANDSHAKE:
        this.setConnected(true);
        break;

      default:
        console.error('Unlnown notification ', messagae);
    }
  }

  /**
   * Clear connection
   */
  public cleanup() {
    if (this.socket.connected) {
      this.socket.off(SOCKET_MESSAGE.MESSAGE);
      this.socket.off(SOCKET_MESSAGE.NOTIFICATION);
      this.socket.disconnect();
    }
  }
}