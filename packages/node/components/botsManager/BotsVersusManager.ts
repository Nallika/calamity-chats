import { NotificationType, SocketMessage } from '@calamity-chats/types';

import BotsManager from './BotsManager';
import { NotificationHandler, SendHandler } from '../../types';

/**
 * Class for storring active bots for particular chat
 */
export default class BotsVersusManager extends BotsManager {

  /**
   * This func will run on user message received, pick bot's to react and make them send message via responseHandler
   */
  reactOnMessage = async (message: SocketMessage, responseHandler: SendHandler, notificationHandler: NotificationHandler) => {
    try {
      const { message: parsedMessage } = await this._parseMessage(message.body);
      const chosen = this._chooseBotsToReact();
  
      chosen.reduce(async (input, bot) => {
        // Wait previous response
        const inputMessage = await input;

        // Send typing notification
        notificationHandler({type: NotificationType.TYPING, subject: bot.botName});

        // Wait add get answer from bot
        const answer = await bot.getAnswer(inputMessage, {});

        // Send message only if it exists
        if (message) {
          this._handleSendMessage(answer, bot.botName, responseHandler);
        }

        // Return answer for further processing
        return answer;
      }, Promise.resolve(parsedMessage));
    } catch (error) {
      console.error('BotsVersusManager: Error when tried to reace on message for ', error);
    }
  }
}