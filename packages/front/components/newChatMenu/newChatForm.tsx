'use client';

import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react';
import { Formik, Form } from 'formik';

import { ChatModeEnum } from 'calamity-chats-types';

import Card from '../ui/card';
import Button from '../ui/button/button';
import Loader from '../ui/loader';
import { BotsMap, SetUpChatParams, StartChatForm } from '../../types';
import BotsList from '../botsList';
import ModeSelector from '../modeSelector';
import { initNewChat } from '../../utils/requests';
import { fromatBotsForRequest, getChatUrl, saveChatId } from '../../utils';
import MessagesStore from '../../store/MessagesStore';

/**
 * Send request to server and kick off new chat
 */
export const NewChatForm: React.FC<{setUpChatParams: SetUpChatParams}> = observer(({setUpChatParams}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { bots, modes } = setUpChatParams;
  const botsMap = bots.reduce((acc: BotsMap, bot) => {
    acc[bot] = true;
    return acc;
  }, {});

  const initialValues = {
    mode: ChatModeEnum.REGULAR,
    selectedBots: botsMap
  };

  /**
   * Send chat init request with provided by user data
   * Server return `chatId` if chat creation was successfull redirect to chat page in this case, show error otherwise
   */
  const handleStartNewChat = async (data: StartChatForm) => {
    setLoading(true);

    const { chatId } = await initNewChat({
      mode: data.mode,
      selectedBots: fromatBotsForRequest(data.selectedBots)
    });

    if (chatId) {
      // Init store to point ChatContext that chat was initialized in this session
      MessagesStore.createInstance(chatId).setIsInitialized();
      saveChatId(chatId);
      router.push(getChatUrl(data.mode));
    } else {
      setLoading(false);
      // @todo: show error
    }
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div>
        <Card className="h-auto w-auto">
        <Formik
          initialValues={initialValues}
          onSubmit={handleStartNewChat}
        >
            <Form>
              <div className="pb-4 grid grid-cols-2 grid-rows-2 gap-4 items-center">
                <label>Chose bots to chat:</label>
                <BotsList bots={bots} />
                <label>Chat mode:</label>
                <ModeSelector modes={modes} />
              </div>
              <div className="flex justify-center">
                <Button type="submit" title="Start new chat"></Button>
              </div>
            </Form>
          </Formik>
        </Card>
      </div>
    </div>
  );
});
