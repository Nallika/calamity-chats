import axios from 'axios';
import crypto from 'crypto';

import { BotConfig } from '../types';
import { OPEN_AI_API_URL } from '../constants';

import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Request to openAI API for completion
 */
export const requestToOpenAI = async (prompt: string, config: BotConfig): Promise<string> => {
  try {
    const response = await axios.post(OPEN_AI_API_URL,
      {
        model: process.env.OPEN_AI_MODEL,
        messages: [
        // Tunned role
        {
          role: 'system',
          content: `${config.manner}. ${config.context}`
        },
        // Actual prompt
        {
          role: 'user',
          content: `${prompt}`
        }],
        temperature: config.temperature,
        max_tokens: config.max_tokens,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const {content} = response.data.choices[0].message;
    return content;

  } catch (error) {
    console.error(`Request to OpenAI error = ${error}`);

    return '';
  }
}

// Generate chat id from user id and current time
export const createChatId = (userId: string):string => 
  crypto.createHash('md5').update(`${userId}_${Date.now()}`).digest('hex');

/**
 * Shuffle provided array
 */
export const shuffle = <T>(arr: Array<T>): Array<T>  => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  return arr;
}

/**
 * Get boolean values from provided string
 */
export const parseBooleanString = (str: string): boolean[] => {
  const regex = /(True|False|true|false)/g;
  const matches = [...str.matchAll(regex)];

  return matches.map((match) => match[0].toLowerCase() === 'true');
};
