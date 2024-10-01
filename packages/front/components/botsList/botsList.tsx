'use client';

import React from 'react';
import { useField, useFormikContext } from 'formik';

import { BotsMap } from '@/types';

/**
 * List of currently available bots with checkboxes
 */
const BotsList: React.FC<{bots: string[]}> = ({ bots }) => {
  const { setFieldValue } = useFormikContext();
  const [ field ] = useField("selectedBots");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    const selectedBotsState = field.value as BotsMap;
    const selectedBotsCount = Object.values(selectedBotsState).reduce((acc, val) => acc + Number(val), 0);
    const newSelectedBotsCount = checked ? selectedBotsCount + 1 : selectedBotsCount - 1;

    // @todo: for some reason here bug, fix it
    if (newSelectedBotsCount < 1) {
      event.preventDefault();
      return;
    }
  
    setFieldValue(name, checked);
  }

  return (
    <div className="flex flex-row justify-between">
        {bots.map(bot => (
          <label key={bot} className="p-4">
            <input
              {...field}
              type="checkbox"
              name={`selectedBots.${bot}`}
              defaultChecked={true}
              onChange={handleChange}
            />
            {bot}
          </label>
        ))}
      </div>
  );
};

export default React.memo(BotsList);