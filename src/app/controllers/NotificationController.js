import User from '../models/Users';
import Notification from '../schemas/Notification';

class NotificationController {
  async index(__request, __response) {
    /**
     * Check user is a provider.
     */
    const isProvider = await User.findOne({
      where: { id: __request.userId, provider: true },
    });

    if (!isProvider) {
      return __response
        .status(401)
        .json({ error: 'Only provider can read notifications!' });
    }

    /**
     * Find all notifications by userId.
     * order by createdAt.
     */
    const notifications = await Notification.find({
      user: __request.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return __response.json(notifications);
  }
}

export default new NotificationController();
