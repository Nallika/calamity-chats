import axios from 'axios';

import { URLS } from '@/front/constants';
import { ChatInitData } from '@/front/types';
import { getToken, saveToken } from '.';


export const initNewChat = async (data: ChatInitData) => {
  try {
    const {name, selectedBots: selectedBotsMap} = data;
    const selectedBots = Object.keys(selectedBotsMap).filter((botName) => selectedBotsMap[botName] && botName);

    const { data: { token, chatId }} = await axios.post(
      URLS.INIT_CHAT, 
      {name, selectedBots},
      {
        headers: {
          'Authorization': getToken()
        }
      }
    );

    saveToken(token);

    return chatId;
  } catch (error: any) {

    console.error('LOAD CHAT ERROR! ', error);

    return {
      chatId: ''
    }
  }
}

export const connectChat = async (chatId: string) => {
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