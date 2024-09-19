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
        messages: [{
          role: 'user',
          content: `${config.maner}, ${prompt}`
        }],
        temperature: config.temperature
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

export const createChatId = (userId: string):string => crypto.createHash('md5').update(userId).digest('hex');