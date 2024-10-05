import log4js from 'log4js';
import { ChatModeEnum, NotificationType, SocketMessage } from '@calamity-chats/types';

import ChatBot from '../chatBot/ChatBot';
import { BotsCollection, BotsManagerInterface, NotificationHandler, ParsedMessage, SendHandler } from '../../types';
import { BOT_NAMES } from '../../constants/botConfig';
import { parseBooleanString, shuffle } from '../../utils';

/**
 * Class for storring active bots for particular chat
 */
export default class BotsManager implements BotsManagerInterface {

  parseBot: ChatBot;
  collection: BotsCollection;

  constructor(bots: Array<BOT_NAMES>, mode: ChatModeEnum) {
    this.collection = this._initCollection(bots, mode);
    this.parseBot = new ChatBot(BOT_NAMES.PARSER)
  }

  _initCollection(bots: Array<BOT_NAMES>, mode: ChatModeEnum): BotsCollection {
    return bots.reduce((acc, botName) => {
      acc[botName] = new ChatBot(botName, mode);
      return acc;
    }, {} as BotsCollection);
  }

  /**
   * Try to get additional info about message by asking special bot to parse it.
   * Return message alongside with affitional metadata.
   */
  async _parseMessage(message: string): Promise<ParsedMessage> {
    const answer = await this.parseBot.getAnswer(message, {});

    // Log parsed answer for further correction
    const logger = log4js.getLogger('botsLog');
    logger.debug(`Input message: ${message} | parse result : ${answer}`);

    const parsedResult = parseBooleanString(answer);

    if (!parsedResult.length) {
      return { message, metadata: {} };
    }

    const metadata = {
      isSentence: parsedResult[0],
      isQuestion: parsedResult[1],
      isStatement: parsedResult[2],
    }

    return { message, metadata };
  }

  /**
   * Format message and send to socket via provided handler
   */
  _handleSendMessage(message: string, botName: BOT_NAMES, responseHandler: SendHandler) {
    responseHandler({
      body: message,
      sender: botName,
      time: Date.now()
    })
  }

  /**
   * @TODO Add mechanizm that will analize message metadata @see _parseMessage and choose better bot/bots to react
   */
  _chooseBotsToReact(): ChatBot[] {
    return shuffle(Object.values(this.collection));
  }

  /**
   * This func will run on user message received, pick bot's to react and make them send message via responseHandler
   */
  reactOnMessage = async (message: SocketMessage, responseHandler: SendHandler, notificationHandler: NotificationHandler) => {
    try {
      const { message: parsedMessage, metadata } = await this._parseMessage(message.body);
      const chosen = this._chooseBotsToReact();
  
      chosen.forEach(async (bot) => {
        // Send typing notification
        notificationHandler({type: NotificationType.TYPING, subject: bot.botName});
  
        const message = await bot.getAnswer(parsedMessage, metadata);

        // Send message only if it exists
        if (message) {
          this._handleSendMessage(message, bot.botName, responseHandler);
        }
      })
    } catch (error) {
      console.error('BotsManager: Error when tried to reace on message for ', error);
    }
  }
}