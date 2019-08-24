import User from '../models/Users';
import File from '../models/File';

class ProviderController {
  /**
   * Access User Models to search all users that is a provider.
   *
   * @return Providers users.
   */
  async index(__request, __response) {
    const providers = await User.findAll({
      where: { provider: true },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });
    return __response.json(providers);
  }
}

export default new ProviderController();
