import { Router } from 'express';
import { getUsersForSidebar, getMessages, markMessageAsSeen, sendMessage } from '../controllers/message.controller';
import { authVerify } from '../middlewares/authVerify';

const messageRouter = Router();

messageRouter.get('/users', authVerify, getUsersForSidebar);
messageRouter.get('/:id', authVerify, getMessages);
messageRouter.put('/mark/:id', authVerify, markMessageAsSeen);
messageRouter.post('/send/:id', authVerify, sendMessage);


export default messageRouter;