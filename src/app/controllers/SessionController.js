import jwt from 'jsonwebtoken';
import User from '../models/Users';
import File from '../models/File';
import authConfig from '../../config/auth';

class SessionController {
  async store(__request, __response) {
    const { email, password } = __request.body;
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });
    if (!user) {
      return __response.status(401).json({ error: 'User not found' });
    }
    if ((await user.passwordCorrect(password)) === false) {
      return __response.status(401).json({ error: 'Password does not match' });
    }
    const { id, name, avatar, provider } = user;
    return __response.json({
      user: {
        id,
        name,
        email,
        avatar,
        provider,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
