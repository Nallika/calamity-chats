'use client';

import React from 'react';
import { useField, useFormikContext } from 'formik';

import { ChatModeEnum } from 'calamity-chats-types';

/**
 * Select box for chat modes
 */
const ModeSelector: React.FC<{modes: ChatModeEnum[]}> = ({modes}) => {
  const { setFieldValue } = useFormikContext();
  const [ field ] = useField("mode");

  return (
    <select 
      {...field}
      value={field.value}
      className="w-48 p-2 border border-gray-300 rounded-md bg-[--color-background] text-[--color-text] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--color-primary]"
      onChange={(e) => setFieldValue(field.name, e.target.value)}
    >
      {modes.map((mode, index) => <option value={mode} key={index}>{mode}</option>)}
    </select>
  );
};

export default React.memo(ModeSelector);