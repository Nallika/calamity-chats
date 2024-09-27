'use client';

import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react';
import { useFormik } from 'formik';

import Card from '../ui/card';
import Button from '../ui/button/button';
import Loader from '../ui/loader';

import Input from '../ui/input';
import { BotsMap, ChatInitParams, StartChatForm } from '../../types';
import BotsList from '../botsList';
import { initNewChat } from '../../utils/requests';
import { fromatBotsForRequest, saveChatId } from '../../utils';

/**
 * Send request to server and kick off new chat
 */
export const NewChatForm: React.FC<{chatInitParams: ChatInitParams}> = observer(({chatInitParams}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { bots } = chatInitParams;
  const botsMap = bots.reduce((acc: BotsMap, bot) => {
    acc[bot] = true;
    return acc;
  }, {});

  /**
   * Send chat init request with provided by user data and.
   * Server return `chatId` if chat creation was successfull redirect to chat page in this case, show error otherwise
   */
  const handleStartNewChat = async (data: StartChatForm) => {
    setLoading(true);

    const { chatId } = await initNewChat({
      name: data.name,
      selectedBots: fromatBotsForRequest(data.selectedBots)
    });

    if (chatId) {
      saveChatId(chatId);
      router.push('/chat');
    } else {
      setLoading(false);
    }
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      selectedBots: botsMap

    },
    onSubmit: handleStartNewChat,
  });

  const handleSelectBotClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    const selectedBotsState = formik.values['selectedBots'];
    const selectedBotsCount = Object.values(selectedBotsState).reduce((acc, val) => acc + Number(val), 0);
    const newSelectedBotsCount = checked ? selectedBotsCount + 1 : selectedBotsCount - 1;

    if (newSelectedBotsCount < 1) {
      event.preventDefault();
      return;
    }
  
    formik.setFieldValue(name, checked);
  }

  if (loading) {
    return <Loader />;
  }

  return (
  <div className="h-full flex flex-col items-center justify-center">
    <div>
        <Card className="h-auto w-auto">
          <form onSubmit={formik.handleSubmit}>
            
            <div className="flex flex-row justify-between">
              <label className="p-4">
                Chose bots to chat:
              </label>
              <BotsList bots={bots} onChange={handleSelectBotClick} />
            </div>
            
            <div className="flex flex-row justify-between">
              <div className="p-4">
                Your name:
              </div>
              <Input 
                className="w-48"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            
            <div className="flex justify-center">
              <Button type="submit" title="Start new chat" clickHandler={formik.handleSubmit}></Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
});
