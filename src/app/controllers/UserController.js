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
    return __response.json({ ok: true });
  }
}

export default new UserController();
