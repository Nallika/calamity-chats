import { Namespace, Server, Socket } from 'socket.io';

import { ChatModeEnum, NotificationMessage, NotificationType, SocketMessage, SocketMessageEnum } from '@calamity-chats/types';

import BotsManager from './BotsManager';
import { createChatId } from '../utils'
import { BOT_NAMES } from '../constants/botConfig';

/**
 * Class for manage chat.
 * Here we init connection, add bot's to chat and listen messages
 */
export class ChatManager {

  userId: string;
  chatId: string;
  mode: ChatModeEnum | null = null;

  namespace: Namespace;

  lastActive?: number;

  botsManager?: BotsManager;

  connected: boolean = false;

  constructor(io: Server, userId: string) {
    this.userId = userId;
    this.chatId = createChatId(userId);
    this.namespace = io.of(`/user-${this.chatId}`);
  }

  /**
   * Kick off actuall chat
   */
  private initConnection() {
    this.namespace.on('connection', (socket) => {
      this.connected = true;
      this._updateActive();
      console.log('----> Connected new user, ', {userId: this.userId, chatId: this.chatId});

      socket.on(SocketMessageEnum.NOTIFICATION, (message) => {
        this.onNotification(socket, message);
      })

      socket.on(SocketMessageEnum.INPUT_MESSAGE, (message: SocketMessage) => {
        this._updateActive();

        const responseHandler = async (message: SocketMessage) => {
          socket.emit(SocketMessageEnum.OUTPUT_MESSAGE, message);
        }

        this.botsManager?.reactOnMessage(message, responseHandler);
      });

      socket.on('disconnect', () => {
        this.connected = false;
        console.log('<---- Disconnected user, ', this.userId);
        this.cleanup();
      });
    });
  }

  /**
   * Clear chat connection
   */
  private cleanup() {
    this.namespace.removeAllListeners();
  }

  /**
   * Clear chat connection
   */
  private _updateActive() {
    this.lastActive = Date.now();
  }

  /**
   * Add provided bots and set mode
   */
  setUpChat = (bots: Array<BOT_NAMES>, mode: ChatModeEnum) => {
    this.mode = mode;
    this.botsManager = new BotsManager(bots);

    return this.chatId;
  }

  /**
   * Validate input data and run connect to chat
   */
  connectToChat = (chatId: string, mode: ChatModeEnum): boolean => {
    if (!chatId || chatId !== this.chatId || !mode || mode !== this.mode) {
      console.error('Cannot connect to chat, due missmatched data ', {chatId: this.chatId, mode: this.mode});
      return false;
    }

    this.initConnection();
    return true;
  }

  private sendHandshake = (socket: Socket, messagae: NotificationMessage) => {
    socket.emit(SocketMessageEnum.NOTIFICATION, {type: NotificationType.HANDSHAKE});
  }

  private onNotification = (socket: Socket, messagae: NotificationMessage) => {
    switch (messagae.type) {
      case NotificationType.HANDSHAKE:
        this.sendHandshake(socket, messagae);
        break;

      default:
        console.error('Unlnown notification ', messagae);
    }
  }

  // @TODO: TBD
  isInactive() {
    // logic to determine if this chat manager is inactive
    return false;
  }
}
