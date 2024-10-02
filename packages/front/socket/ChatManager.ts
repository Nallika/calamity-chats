import { io, Socket } from "socket.io-client";

import { NotificationMessage, NotificationType, SocketMessageEnum, ChatModeEnum } from '@calamity-chats/types';

import { ChatManagerParams, ConnectedToggle, SendMessageHandler, SocketMessage } from '../types';

/**
 * Maitain socket connection, send / receive messages
 */
export class ChatManager {
  private socket: Socket;

  private static chatId: string;
  private static instance: ChatManager;

  private mode: ChatModeEnum;

  // Pending connection flag, used to prevent multiple connections
  private pending: boolean = false;

  // For forvard connected status
  private setConnected: ConnectedToggle;

  constructor({chatId, mode, setConnected}: ChatManagerParams) {
    ChatManager.chatId = chatId;

    this.setConnected = setConnected;
    this.mode = mode;

    this.socket = io(`/user-${chatId}`, {
      reconnection: true,
      reconnectionAttempts: 1,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      this.pending = false;
      this.sendHandshake();
    });

    this.socket.on('disconnect', () => {
      this.setConnected(false);
      this.pending = false;
    });

    this.socket.on('reconnect', () => {
      this.sendHandshake();
      this.pending = false;
    });
  }

  /**
   * Create singleton instance for each new chat, to maintain single uniq connection for each chat
   */
  public static createInstance(params: ChatManagerParams): ChatManager {
    if (!ChatManager.instance || ChatManager.chatId !== params.chatId) {
      ChatManager.instance = new ChatManager(params);
    }
    
    return ChatManager.instance;
  }

  /**
   * Initialize subscription with provided callaback to store messages
   */
  public subscribeToMessages(addMessage: SendMessageHandler) {
    // Add check on pending connection to avoid multiple subscription
    if (!this.pending) {
      this.socket.on(SocketMessageEnum.OUTPUT_MESSAGE, addMessage);
      this.socket.on(SocketMessageEnum.NOTIFICATION, this.onNotification);
      this.pending = true;
    }
  }

  /**
   * Send already formatted message to server
   */
  public sendSocketMessage = (message: SocketMessage) => {
    this.socket.emit(SocketMessageEnum.INPUT_MESSAGE, message);
  };

  /**
   * Send hanshake message to back
   */
  public sendHandshake = () => {
    this.socket.emit(SocketMessageEnum.NOTIFICATION, {
      type: NotificationType.HANDSHAKE,
      mode: this.mode
    });
  };

  /**
   * When handshake received current chat may count as connected
   */
  public onHandshakeReceived = () => {
    this.setConnected(true);
  };

  private onNotification = (messagae: NotificationMessage) => {
    switch (messagae.type) {
      case NotificationType.HANDSHAKE:
        this.onHandshakeReceived();
        break;
      default:
        console.error('Unknown notification ', messagae);
    }
  }

  /**
   * Clear connection
   */
  public cleanup() {
    if (this.socket.connected) {
      this.socket.off(SocketMessageEnum.OUTPUT_MESSAGE);
      this.socket.off(SocketMessageEnum.NOTIFICATION);
      this.socket.disconnect();
    }
  }
}