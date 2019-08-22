import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (__request, __response, __next) => {
  const authHeader = __request.headers.authorization;

  if (!authHeader) {
    return __response.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' ');
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    __request.userId = decoded.id;
    return __next();
  } catch (error) {
    return __response.status(401).json({ error: 'Token invalid' });
  }
};
