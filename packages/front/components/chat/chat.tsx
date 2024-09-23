'use client';
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react';

import { ChatContextProvider } from '../../context/ChatContext';
import { connectChat } from '../../utils/requests';
import { getChatId } from '../../utils';
import MessageInput from '../messageInput';
import MessagesList from '../messagesList';
import Card from '../ui/card';
import Loader from '../ui/loader/loader';

/**
 * Send request to server and kick off new chat
 */
export const Chat = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const goHome = useCallback(() => {
    router.push('/');
  }, [router])

  useEffect(() => {
    const id = getChatId();

    if (!id) {
      goHome();
    }

    connectChat(id).then(({connected}) => {
      if (!connected) {
        goHome();
      } else {
        setLoading(false);
      }
    });
  }, [goHome]);

  if (loading) {
    return <Loader />;
  }

  return (
    <ChatContextProvider>
       <Card>
        <div className='flex-1 overflow-y-auto'>
          <MessagesList />
        </div>
        <div className='flex'>
          <MessageInput />
        </div>
      </Card>
    </ChatContextProvider>
  );
};
