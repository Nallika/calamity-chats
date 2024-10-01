import React from 'react';

type ButtonProps = {
  title?: string,
  clickHandler?: () => void,
 } & React.ButtonHTMLAttributes<HTMLButtonElement>; 

/**
 * Simple button
 */
const Button: React.FC<ButtonProps> = ( { title, clickHandler, ...buttonProps} ) => {
   return (
    <button 
      {...buttonProps}
      className='z-10 w-full max-w-xs py-2 px-4 bg-blue-500 text-white font-bold rounded-lg shadow-lg transition transform duration-200 ease-in-out hover:bg-blue-600 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'
      onClick={() => clickHandler?.()}
    >
      {title}
    </button>
   );
 }

 export default React.memo(Button);
 