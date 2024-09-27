
/**
 * Socket identity for user message from front
 */
export const SOCKET_IN_MESSAGE = 'socket_input_message';

/**
 * Socket identity for bot answer from back
 */
export const SOCKET_OUT_MESSAGE= 'socket_output_message';

/**
 * @todo!
 */
export const SOCKET_NOTIFICATION= 'socket_notification';

const urlPrefix = process.env.NEXT_PUBLIC_API_BASE_URL ? process.env.NEXT_PUBLIC_API_BASE_URL : '';

export const URLS = {
  INIT_CHAT: `${urlPrefix}/api/initChat`,
  CONNECT_CHAT: `${urlPrefix}/api/connectChat`,
  CHAT_PARAMS: `${urlPrefix}/api/chatParams`,
}

export const CHAT_ID_HASH = 'chat_id';

export const TOKEN = 'token';