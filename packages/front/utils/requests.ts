import axios from 'axios';

import { URLS } from '../constants';
import { ChatInitRequestData } from '../types';
import { getToken, saveToken } from '.';


/**
 * Kick off new chat on backend, return chatId for socket connect
 */
export const initNewChat = async (data: ChatInitRequestData): Promise<{chatId: string}> => {
  try {
    const { data: { token, chatId }} = await axios.post(
      URLS.INIT_CHAT, 
      data,
      {
        headers: {
          'Authorization': getToken()
        }
      }
    );

    saveToken(token);

    return {chatId};
  } catch (error: any) {
    console.error('LOAD CHAT ERROR! ', error);

    return {
      chatId: ''
    }
  }
}

export const connectChat = async (chatId: string): Promise<{connected: boolean}> => {
  try {
    const { data: { connected }} = await axios.post(
      URLS.CONNECT_CHAT, 
      {chatId},
      {
        headers: {
          'Authorization': getToken()
        }
      }
    );

    return {
      connected
    }
  } catch (error: any) {
    console.error('CONNECT CHAT ERROR! ', error);

    return {
      connected: false
    }
  }
}