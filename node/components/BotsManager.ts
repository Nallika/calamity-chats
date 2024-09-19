import ChatBot from './ChatBot';
import { BotsCollection, SocketMessage } from '../types';
import { BOT_NAMES } from '../constants/botConfig';

/**
 * Class for storring active bots for particular chat
 */
export default class BotsManager {

  collection: Partial<BotsCollection> = {};

  constructor(bots: Array<BOT_NAMES>) {
    bots.forEach((botName) => {
      this.collection[botName] = new ChatBot(botName);
    });
  }

  /**
   * @TODO parse message and eject some metadata, is it question, what mood, e.t.c.
   * Return metatadata alongside with message
   */
  private _parseMessage(message: string) {
    return message;
  }

  /**
   * @TODO Add mechanizm that will analize message metadata @see _parseMessage and choose better bot/bots to react
   */
  private _chooseBotsToReact(): ChatBot[] {
    return Object.values(this.collection);
  }

  /**
   * This func will run on user message received, pick bot's to react and make them send message via responseHandler
   */
  reactOnMessage = async (message: SocketMessage, responseHandler: (message: SocketMessage) => void) => {
    const parsedMessage = this._parseMessage(message.body);
    const chosen = this._chooseBotsToReact();

    chosen.forEach(async (bot) => {
        const message = await bot.getAnswer(parsedMessage);
        responseHandler(message)
    })
  }
}