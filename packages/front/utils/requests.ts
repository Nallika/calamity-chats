import axios from 'axios';

import { ChatInitRequestData, StartChatRequestData } from 'calamity-chats-types';

import { API } from '../constants';
import { getToken, saveToken } from '.';


/**
 * Kick off new chat on backend, return chatId for socket connect
 */
export const initNewChat = async (data: ChatInitRequestData): Promise<{chatId: string}> => {
  try {
    const { data: { token, chatId }} = await axios.post(
      API.INIT_CHAT, 
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

export const connectChat = async (data: StartChatRequestData): Promise<{connected: boolean}> => {
  try {
    const { data: { connected }} = await axios.post(
      API.CONNECT_CHAT, 
      data,
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