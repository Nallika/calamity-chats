import http from 'http';
import ChatBot from '../components/chatBot/ChatBot';
import { BOT_NAMES } from '../constants/botConfig';
import { NotificationMessage, SocketMessage } from '@calamity-chats/types';

export type HtttpServer = http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

export type BotConfig = {
  context: string,
  manner: string,
  max_tokens: number,
  temperature: number,
  top_p: number,
  frequency_penalty: number,
  presence_penalty: number,
}

export type BotConfigMap = {
  [key in BOT_NAMES]: BotConfig;
}

export type BotsCollection = {
  [key in BOT_NAMES]: ChatBot
}

export type SendHandler = (message: SocketMessage) => void;

export type NotificationHandler = (message: NotificationMessage) => void;

export interface Credentials {
  id: string;
  token: string;
}

export interface UserData extends Credentials {
  name: string;
}
export interface BotsManagerInterface {
  collection: BotsCollection;

  /**
   * @TODO parse message and eject some metadata, is it question, what mood, e.t.c.
   * Return metatadata alongside with message
   */
  _parseMessage(message: string): void;

  /**
   * @TODO Add mechanizm that will analize message metadata @see _parseMessage and choose better bot/bots to react
   */
  _chooseBotsToReact(): ChatBot[];

  /**
   * This func will run on user message received, pick bot's to react and make them send message via responseHandler
   */
  reactOnMessage(message: SocketMessage, responseHandler: SendHandler, notificationHandler: NotificationHandler): void;
}

export type MessageMetadata = Partial<{
  isSentence: boolean,
  isQuestion: boolean,
  isStatement: boolean,
}>;

export type ParsedMessage = {
  message: string;
  metadata: MessageMetadata
}