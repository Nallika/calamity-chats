import { ChatModeEnum } from '@calamity-chats/types';

import BotsVersusManager from './BotsVersusManager';
import BotsManager from './BotsManager';
import BotsAdvicerManager from './BotsAdvicerManager';
import { BotsManagerInterface } from '../../types';
import { BOT_NAMES } from '../../constants/botConfig';

/**
 * Get bot manager for provided chat mode
 */
export const getBotsManager = (mode: ChatModeEnum, bots: Array<BOT_NAMES> ): BotsManagerInterface => {
  switch (mode) {
    case ChatModeEnum.PROS_CONS:
      return new BotsAdvicerManager(bots, mode);
    case ChatModeEnum.VERSUS:
      return new BotsVersusManager(bots, mode);
    default:
      return new BotsManager(bots, mode);
  }
}