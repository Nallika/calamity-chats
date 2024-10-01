import { ChatModeEnum } from 'calamity-chats-types';

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
 * Message structure fir Mobx store
 */
export interface StorredMessage extends SocketMessage {
  input: boolean;
}

export enum NotificationType {
  HANDSHAKE = 'handshake',
}

export interface NotificationMessage {
  type: NotificationType;
}

/**
 * Send message func
 */
export type SendMessageHandler = (message: SocketMessage) => void;

/**
 * Data for chat init page (index)
 */
export type SetUpChatParams = {
  bots: string[];
  modes: ChatModeEnum[];
}

/**
 * Bot name mapped to active toggle
 */
export type BotsMap = Record<string, boolean>;

/**
 * Data that we send to connect chnat
 */
export type StartChatForm = {
  mode: ChatModeEnum;
  selectedBots: BotsMap;
}

/**
 * Context provided props
 */
export type ChatContextValue = {
  loading: boolean;
  error: boolean;
  connected: boolean;
  messages: StorredMessage[];
  sendMessage: (message: string) => void;
}

export type ConnectedToggle = (connected: boolean) => void;

export type ChatManagerParams = {
  chatId: string,
  mode: ChatModeEnum,
  setConnected: ConnectedToggle
}