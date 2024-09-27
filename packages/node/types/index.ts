import http from 'http';
import ChatBot from '../components/ChatBot';
import { BOT_NAMES } from '../constants/botConfig';

export type HtttpServer = http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

export type BotConfig = {
  context: string,
  maner: string,
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

export type SendHandler = (message: string) => void;

export interface Credentials {
  id: string;
  token: string;
}

export interface UserData extends Credentials {
  name: string;
}