'use client';
import { useRouter } from 'next/navigation'

import { ChatStoreProvider } from '@/front/store/ChatStoreContext';
import { SocketManager } from '@/front/socket/SocketManager';
import MessageInput from '../messageInput';
import MessagesList from '../messagesList';
import Card from '../ui/card';
import { getChatId } from '@/front/utils';
import { useCallback, useEffect, useState } from 'react';
import Loader from '../ui/loader/loader';
import { connectChat } from '@/front/utils/requests';

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

  const socketManager = new SocketManager(getChatId());

  return (
    <ChatStoreProvider socketManager={socketManager}>
       <Card>
        <div className='flex-1 overflow-y-auto'>
          <MessagesList />
        </div>
        <div className='flex'>
          <MessageInput />
        </div>
      </Card>
    </ChatStoreProvider>
  );
};
