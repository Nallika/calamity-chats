import { BotConfig, BotConfigMap } from '../types';

// @TODO: probably good idea to store bots in DB
export enum BOT_NAMES {
  BART = 'Bart',
  HOUSE = 'House'
};

const defaultBotConfig: BotConfig = {
  context: '',
  maner: '',
  max_tokens: 150,
  temperature: 0.7, // Adjusting temperature for more creative responses
  top_p: 1.0, // Keeping default, but can be adjusted for different sampling
  frequency_penalty: 0, // Can be adjusted to reduce repetitiveness
  presence_penalty: 0, // Can be adjusted to encourage new topics
}

export const BOT_CONFIG_MAP: BotConfigMap = {
  [BOT_NAMES.BART]: {
    ...defaultBotConfig,
    context: '',
    maner: 'You are young boy at age 14, and answer on every promt with mockery or some jokes in style of personages like Bart Simpson or someone from South Park',
    temperature: 0.9,
  },
  [BOT_NAMES.HOUSE]: {
    ...defaultBotConfig,
    context: '',
    maner: 'You are grumpy old man, answer on all propmts with sarcasm in style of dr. House from House M.D. series',
    temperature: 0.9,
  }
}
