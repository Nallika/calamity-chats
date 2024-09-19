'use client';

import { useContext, useRef } from 'react';

import Button from '@/front/components/ui/button';
import Input from '@/front/components/ui/input';
import Card from '../ui/card';
import { ChatStoreContext } from '@/front/store/ChatStoreContext';
 
/**
 * Chat conent container, showed only when chat initialized
 */
export const MessageInput = () => {
  const { sendMessage } = useContext(ChatStoreContext);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = () => {
    const message = inputRef?.current?.value;

    if (message) {
      sendMessage?.(message);
      inputRef.current!.value = '';
    }
  }

  return (
    <Card className="pb-0 pl-0 pr-0">
      <div className='flex flex-row gap-4'>
        <div className='flex-1 w-full'>
          <Input inputRef={inputRef} submitHandler={handleSubmit} />
        </div>
        <div className='w-[100px]'>
          <Button title='Send' clickHandler={handleSubmit} />
        </div>
      </div>
    </Card>
  );
}
