
/**
 * Base message structure
 */
export interface MessageBody {
  body: string;
}

/**
 * Message structure thar we send trough socket
 */
export interface SocketMessage extends MessageBody {
  sender: string;
  time: number;
}

/**
 * Data for chat init page (index)
 */
export type ChatInitParams = {
  bots: string[];
}

export enum SOCKET_MESSAGE {
  NOTIFICATION= 'socket_notification',
  MESSAGE = 'message'
}

export enum NotificationType {
  HANDSHAKE = 'handshake',
}

export interface NotificationMessage {
  type: NotificationType;
}

export interface TestType {
  type: NotificationType;
}