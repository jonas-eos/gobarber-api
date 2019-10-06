import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';
import User from '../models/Users';

class ScheduleController {
  /**
   * List all scheduled task from user provider.
   * The active user must be a provider, else case, will throw a error.
   */
  async index(__request, __response) {
    const isUserProvider = await User.findOne({
      where: { id: __request.userId, provider: true },
    });

    if (!isUserProvider) {
      return __response.status(401).json({ error: 'User is not a provider!' });
    }

    const { date } = __request.query;
    const parsedDate = parseISO(date);
    const appointments = await Appointment.findAll({
      where: {
        provider_id: __request.userId,
        canceled_at: null,
        date: { [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)] },
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
      order: ['date'],
    });
    return __response.json({ appointments });
  }
}

export default new ScheduleController();
