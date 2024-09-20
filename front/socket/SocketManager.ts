import { io, Socket } from "socket.io-client";
import { SOCKET_IN_MESSAGE, SOCKET_OUT_MESSAGE } from '@/front/constants';
import { AddMessageHandler, SocketMessage } from '@/front/types';

/**
 * Handle scoket connection, send / receive messages
 */
export class SocketManager {
  socket: Socket;

  constructor(chatId: string) {
    this.socket = io(`/user-${chatId}`);

    this.socket.on('connect', () => {
    //  console.log('Connected to socket');
    });

    this.socket.on('disconnect',  () => {
    //  console.log('DIS Connected from socket');
    });

    this.socket.on('reconnect', () => {
    //  console.log('Reconnected with socket server');
    });
  }

  subscribeToMessages(addMessage: AddMessageHandler) {
    this.socket.on(SOCKET_OUT_MESSAGE, addMessage);
  }

  sendSocketMessage = (message: SocketMessage) => {
    this.socket.emit(SOCKET_IN_MESSAGE, message);
  }

  /**
   * @TODO: call it
   */
  cleanup() {
    this.socket.off(SOCKET_OUT_MESSAGE);
    this.socket.disconnect();
  }
}
