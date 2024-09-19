import express from 'express';

import { initializeChat, connectChat } from '../controllers/chatController';
import { getBotsList } from '../controllers/setupController';

const routes = express.Router();

routes.post('/initChat', initializeChat);

routes.post('/connectChat', connectChat);

routes.get('/chatParams', getBotsList);

export default routes;