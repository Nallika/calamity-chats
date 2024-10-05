import React from 'react';

import { ChatModeEnum } from '@calamity-chats/types';

import NewChatForm from '../components/newChatMenu';
import { API } from '../constants';

export default async function Home() {
  // const staticData: ChatInitParams = await fetch(API.CHAT_PARAMS, { cache: 'force-cache' }).then((res) =>
  //   res.json()
  // );

  const staticData = {
    bots: ['Bart', 'House', 'Granny', 'Nero', 'Baxter'],
    modes: Object.values(ChatModeEnum),
  };

  return (
    <NewChatForm setUpChatParams={staticData} />
  );
}