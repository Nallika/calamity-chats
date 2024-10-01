import React, { useContext, useLayoutEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';

import MessageBubble from '../messageBubble';
import { ChatContext } from '../../context/ChatContext';

/**
 * Chat messages list with scroll
 */
const MessagesList = observer(() => {
  const { messages } = useContext(ChatContext);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll on new message
  useLayoutEffect(() => {
    const container = containerRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages?.length]);


  return (
    <div ref={containerRef} className="p-4 wrap h-full overflow-y-auto flex flex-col ">
      {messages?.map((message, index) => <MessageBubble message={message} key={index} />)}
    </div>
  );
});

export default React.memo(MessagesList);