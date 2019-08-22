import * as Yup from 'yup';
import User from '../models/Users';

class UserController {
  async store(__request, __response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(__request.body))) {
      return __response.status(400).json({ error: 'Validation fails' });
    }
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
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });
    if (!(await schema.isValid(__request.body))) {
      return __response.status(400).json({ error: 'Validation fails' });
    }
    const { email, oldPassword } = __request.body;
    const user = await User.findByPk(__request.userId);
    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return __response.status(400).json({ error: 'User already exists.' });
      }
    }
    if (oldPassword && !(await user.passwordCorrect(oldPassword))) {
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
