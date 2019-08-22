import { Router } from 'express';
import User from './app/models/Users';

const routes = new Router();

routes.get('/', async (__request, __response) => {
  const user = await User.create({
    name: 'Téste',
    email: ' teste@dom.com',
    password_hash: '123456',
  });

  return __response.json(user);
});

export default routes;
