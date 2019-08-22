import User from '../models/Users';

class UserController {
  async store(__request, __response) {
    const userExists = await User.findOne({
      where: { email: __request.body.email },
    });

    if (userExists) {
      return __response.status(400).json({ error: 'User already exists.' });
    }
    const { id, name, email, provider } = await User.create(__request.body);
    return __response.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(__request, __response) {
    const { email, oldPassword } = __request.body;
    const user = await User.findByPk(__request.userId);
    const userExists = await User.findOne({
      where: { email: __request.body.email },
    });

    if (userExists) {
      return __response.status(400).json({ error: 'User already exists.' });
    }
    if (!oldPassword && !(await user.passwordCorrect(oldPassword))) {
      return __response.status(401).json({ error: 'Password does not match' });
    }
    const { id, name, provider } = await user.update(__request.body);
    return __response.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
