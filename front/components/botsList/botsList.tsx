'use client';

import React from 'react';

type BotsListProps = {
  bots: string[],
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

/**
 * Send request to server and kick off new chat
 */
const BotsList: React.FC<BotsListProps> = ({ bots, onChange }) => {

  return (
    <div className="flex flex-row justify-between">
        {bots.map(bot => (
          <label key={bot} className="p-4">
            <input
              type="checkbox"
              name={`selectedBots.${bot}`}
              defaultChecked={true}
              onChange={onChange}
            />
            {bot}
          </label>
        ))}
      </div>
  );
};

export default React.memo(BotsList);