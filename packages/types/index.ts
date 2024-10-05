
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

export enum SocketMessageEnum {
  OUTPUT_NOTIFICATION= 'output_notification',
  INPUT_NOTIFICATION= 'input_notification',
  INPUT_MESSAGE = 'input_message',
  OUTPUT_MESSAGE = 'output_message'
}

export enum NotificationType {
  HANDSHAKE = 'handshake',
  TYPING = 'typing',
  LOCKED = 'locked',
  UNLOCKED = 'unlocked'
}

export interface NotificationMessage {
  type: NotificationType;
  subject?: string;
}

export enum ChatModeEnum {
  VERSUS = 'versus',
  PROS_CONS = 'pros_cons',
  REGULAR = 'regular'
}

/**
 * Data that we send to connect chnat
 */
export type ChatInitRequestData = {
  mode: ChatModeEnum;
  selectedBots: string[];
}

/**
 * Data that we send to connect chnat
 */
export type StartChatRequestData = {
  mode: ChatModeEnum;
  chatId: string;
}