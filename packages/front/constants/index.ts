// API routes prefix, dependent on current env
const urlPrefix = process.env.NEXT_PUBLIC_API_BASE_URL ? process.env.NEXT_PUBLIC_API_BASE_URL : '';

// API routes
export const API = {
  INIT_CHAT: `${urlPrefix}/api/initChat`,
  CONNECT_CHAT: `${urlPrefix}/api/connectChat`,
  CHAT_PARAMS: `${urlPrefix}/api/chatParams`,
}

// Key for chatID in LocalStorage
export const CHAT_ID_HASH = 'chat_id';

// Key for token in LocalStorage
export const TOKEN = 'token';