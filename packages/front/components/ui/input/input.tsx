import React, { RefObject } from 'react';

type InputProps = {
 inputRef?: RefObject<HTMLInputElement>,
 submitHandler?: () => void,
} & React.InputHTMLAttributes<HTMLInputElement>; 

/**
 * Simple input
 */
const Input: React.FC<InputProps> = ({ inputRef, submitHandler, ...inputProps }) => {

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      submitHandler?.();
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      onKeyDown={handleKeyDown}
      {...inputProps}
      className={`w-full p-2 h-full text-black border border-primary rounded focus:outline-none ${inputProps.className ? inputProps.className : ''}`}
     />
  );
}

export default React.memo(Input);