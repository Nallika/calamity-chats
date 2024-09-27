import { requestToOpenAI } from '../utils';
import { BotConfig } from '../types';
import { BOT_CONFIG_MAP, BOT_NAMES } from '../constants/botConfig';
import { SocketMessage } from 'calamity-chats-types';

/**
 * Behold!
 * Tuned bot
 */
export default class ChatBot {

  botName: BOT_NAMES;
  botConfig: BotConfig;

  constructor(botName: BOT_NAMES) {
    this.botName = botName;
    this.botConfig = BOT_CONFIG_MAP[this.botName];
  }

  /**
   * Get completion, parse it, return it
   */
  _getResponse = async (message: string) => {
    const response = await requestToOpenAI(message, this.botConfig);

    /**
     * @TODO parse response
     */
    return response; 
  }

  getAnswer = async (message: string): Promise<SocketMessage> => {
    const response = await this._getResponse(message);

    return {
      sender: this.botName,
      body: response,
      time: Date.now()
    };
  }
}