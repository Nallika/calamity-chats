import { Namespace, Server, Socket } from 'socket.io';

import { NotificationMessage, NotificationType, SocketMessage, SOCKET_MESSAGE } from 'calamity-chats-types';

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
  namespace: Namespace;

  lastActive?: number;
  botsManager?: BotsManager;

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
      this._updateActive();
      console.log('----> Connected new user, ', this.userId);

      socket.on(SOCKET_MESSAGE.MESSAGE, (message) => {
        this.onNotification(socket, message);
      })

      socket.on(SOCKET_MESSAGE.MESSAGE, (message: SocketMessage) => {
        this._updateActive();

        const responseHandler = async (message: SocketMessage) => {
          socket.emit(SOCKET_MESSAGE.MESSAGE, message);
        }

        // @todo: add type check
        this.botsManager?.reactOnMessage(message, responseHandler);
      });

      socket.on('disconnect', () => {
        console.log('<---- Disconnected user, ', this.userId);
      });
    });
  }

  /**
   * Clear chat connection
   * @todo think about call this maybe ?
   */
  private _cleanup() {
    this.namespace.removeAllListeners();
  }

  /**
   * Clear chat connection
   */
  private _updateActive() {
    this.lastActive = Date.now();
  }

  /**
   * Add provided bots and create new chat connection
   */
  setUpChat = (bots: Array<BOT_NAMES>) => {
    console.log(`----> Set up chat for ${this.userId}', with `, bots);
    this.botsManager = new BotsManager(bots);

    return this.chatId;
  }

  connectToChat = (chatId: string): boolean => {
    if (chatId === this.chatId) {
      this.initConnection();
      return true;
    }

    return false;
  }

  private sendHandshake = (socket: Socket) => {
    socket.emit(SOCKET_MESSAGE.NOTIFICATION, {type: NotificationType.HANDSHAKE});
  }

  private onNotification = (socket: Socket, messagae: NotificationMessage) => {
    switch (messagae.type) {
      case NotificationType.HANDSHAKE:
        this.sendHandshake(socket);
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
