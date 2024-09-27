const urlPrefix = process.env.NEXT_PUBLIC_API_BASE_URL ? process.env.NEXT_PUBLIC_API_BASE_URL : '';

export const URLS = {
  INIT_CHAT: `${urlPrefix}/api/initChat`,
  CONNECT_CHAT: `${urlPrefix}/api/connectChat`,
  CHAT_PARAMS: `${urlPrefix}/api/chatParams`,
}

export const CHAT_ID_HASH = 'chat_id';

export const TOKEN = 'token';