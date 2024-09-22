import React from 'react';

import NewChatForm from '../components/newChatMenu';
import { URLS } from '../constants';
import { ChatInitParams } from '../types';

export default async function Home() {
  // const staticData: ChatInitParams = await fetch(URLS.CHAT_PARAMS, { cache: 'force-cache' }).then((res) =>
  //   res.json()
  // );

  const staticData = {
    bots: ['House', 'Bart']
  };

  return (
    <NewChatForm chatInitParams={staticData} />
  );
}