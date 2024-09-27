'use client';
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react';

import { ChatContextProvider } from '../../context/ChatContext';
import { getChatId } from '../../utils';
import Loader from '../ui/loader/loader';
import { Chat } from '../chat/chat';

/**
 * Send request to server and kick off new chat
 */
export const ChatWrapper = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const goHome = useCallback(() => {
    router.push('/');
  }, [router])

  // Check is chat id exists, navigate on index page otherwise
  useEffect(() => {
    const id = getChatId();

    if (!id) {
      goHome();
      return;
    }

    setLoading(false);

  }, [goHome]);

  if (loading) {
    return <Loader />;
  }

  return (
    <ChatContextProvider>
       <Chat />
    </ChatContextProvider>
  );
};
