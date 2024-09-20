import NewChatForm from '@/front/components/newChatMenu';
import { URLS } from '@/front/constants';
import { ChatInitParams } from '@/front/types';

export default async function Home() {
  const staticData: ChatInitParams = await fetch(URLS.CHAT_PARAMS, { cache: 'force-cache' }).then((res) =>
    res.json()
  );

  return (
    <NewChatForm chatInitParams={staticData} />
  );
}