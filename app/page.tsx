import NewChatForm from '@/front/components/newChatMenu';
import { URLS } from '@/front/constants';
import { ChatInitParams } from '@/front/types';

export default async function Home() {
  // const staticData: ChatInitParams = await fetch(URLS.CHAT_PARAMS, { cache: 'force-cache' }).then((res) =>
  //   res.json()
  // );

  // @TODO: solve this, Node refuse to build without server
  const staticData = {bots: ['Bart', 'House']};

  console.log('staticData', staticData);

  return (
    <NewChatForm chatInitParams={staticData} />
  );
}