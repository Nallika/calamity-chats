'use client';

import React, { useContext } from 'react';

import MessageInput from '../messageInput';
import MessagesList from '../messagesList';
import Card from '../ui/card';
import Loader from '../ui/loader/loader';
import { ChatContext } from '../../context/ChatContext';

/**
 * Send request to server and kick off new chat
 */
export const AdvicerChat = () => {
  const { loading } = useContext(ChatContext);

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
