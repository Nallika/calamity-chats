import React from 'react';

/**
 * 
 */
const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`h-full w-full p-4 ${className ? className : ''}`}>
    <div className='p-4 border border-primary flex flex-col h-full box-border shadow-lg rounded-lg'>
      { children }
    </div>
  </div>
);

export default React.memo(Card);
