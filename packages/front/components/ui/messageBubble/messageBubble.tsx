import React from 'react';

import { StorredMessage } from '../../../types';

const MessageBubble: React.FC<{message: StorredMessage}> = ({ message }) => {
  const {body, input, time} = message;
  const messageTime = new Date(time);
  const formattedTime = `${messageTime.getHours().toString().padStart(2, '0')}:${messageTime.getMinutes().toString().padStart(2, '0')}`;

  return (
    <div 
      className={`message mb-2 rounded-lg p-4 flex flex-col min-w-[200px] w-fit ${
        input ? 'bg-pink-400 text-white self-end' : 'bg-blue-500 text-white self-start'
      }`}
    >
      {body}
      <div className="text-xs text-gray-300 self-end mt-1">
        {formattedTime}
      </div>
    </div>
  );
};

export default React.memo(MessageBubble);;
