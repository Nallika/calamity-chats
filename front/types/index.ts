
export interface MessageBody {
  body: string;
}

export interface SocketMessage extends MessageBody {
  sender: string;
  time: number;
}

export interface StorredMessage extends SocketMessage {
  input: boolean;
}

export type AddMessageHandler = (message: SocketMessage) => void;

export type ChatInitParams = {
  bots: string[];
}

export type BotsMap = Record<string, boolean>;

export type ChatInitData = {
  name: string;
  selectedBots: BotsMap
}

export type ChatInitResponse = {
  token: string;
  chatId: string;
}