import { ChatModeEnum, SocketMessage } from '@calamity-chats/types';

import { requestToOpenAI } from '../../utils';
import { BotConfig, MessageMetadata } from '../../types';
import { BOT_CONFIG_MAP, BOT_NAMES, BOTS_CONTEXT } from '../../constants/botConfig';

/**
 * Behold!
 * Tuned bot
 */
export default class ChatBot {
  botName: BOT_NAMES;
  botConfig: BotConfig;

  constructor(botName: BOT_NAMES, mode?: ChatModeEnum) {
    const context = mode && BOTS_CONTEXT[mode] || '';
    this.botName = botName;
    this.botConfig = {
      ...BOT_CONFIG_MAP[this.botName],
      context
    };
  }
  
  /**
   * 
   */
  getAnswer = async (message: string, metadata: MessageMetadata): Promise<string> => {
    return await requestToOpenAI(message, this.botConfig);
  }
}