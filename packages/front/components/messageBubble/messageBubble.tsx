import React from 'react';

import { StorredMessage } from '../../types';

/**
 * Single message item
 */
const MessageBubble: React.FC<{message: StorredMessage}> = ({ message }) => {
  const {body, input, time, sender} = message;
  const title = input ? 'You' : sender;
  const messageTime = new Date(time);
  const formattedTime = `${messageTime.getHours().toString().padStart(2, '0')}:${messageTime.getMinutes().toString().padStart(2, '0')}`;

  return (
    <div 
      className={`message mb-2 rounded-lg p-4 flex flex-col min-w-[200px] ${
        input ? 'bg-pink-400 self-end' : 'bg-blue-500 self-start'
      }`}
    >
      <div className={`${input ?'text-purple-700' : 'text-yellow-300'} font-bold self-start`}>
        {title}
      </div>
      <div className="text-white">{body}</div>
      <div className="text-xs text-gray-300 self-end">
        {formattedTime}
      </div>
    </div>
  );
};

export default React.memo(MessageBubble);;
