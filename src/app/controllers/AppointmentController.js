import * as Yup from 'yup';

import Appointment from '../models/Appointment';
import User from '../models/Users';

class AppointmentController {
  async store(__request, __response) {
    /**
     * Set schema to validate the fields before save on database
     */
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(__request.body))) {
      return __response.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = __request.body;

    /**
     * Check if provider_id is a provider
     */

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return __response
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    /**
     * Create a new appointment on database
     */
    const appointment = await Appointment.create({
      user_id: __request.userId,
      provider_id,
      date,
    });

    return __response.json(appointment);
  }
}

export default new AppointmentController();
