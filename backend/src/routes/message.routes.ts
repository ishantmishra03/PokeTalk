import { Router } from 'express';
import { getUsersForSidebar, getMessages, markMessageAsSeen } from '../controllers/message.controller';
import { authVerify } from '../middlewares/authVerify';

const messageRouter = Router();

messageRouter.get('/users', authVerify, getUsersForSidebar);
messageRouter.get('/:id', authVerify, getMessages);
messageRouter.put('/mark/:id', authVerify, markMessageAsSeen);


export default messageRouter;