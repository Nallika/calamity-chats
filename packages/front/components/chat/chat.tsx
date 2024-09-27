'use client';

import React, { useCallback, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation'

import MessageInput from '../messageInput';
import MessagesList from '../messagesList';
import Card from '../ui/card';
import Loader from '../ui/loader/loader';
import { ChatContext } from '../../context/ChatContext';

/**
 * Send request to server and kick off new chat
 */
export const Chat = () => {
  const { loading, error } = useContext(ChatContext);
  const router = useRouter();

  const goHome = useCallback(() => {
    router.push('/');
  }, [router])

  useEffect(() => {
    if (error) {
      goHome();
    }
  }, [error, goHome]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Card>
      <div className='flex-1 overflow-y-auto'>
        <MessagesList />
      </div>
      <div className='flex'>
        <MessageInput />
      </div>
    </Card>
  );
};
