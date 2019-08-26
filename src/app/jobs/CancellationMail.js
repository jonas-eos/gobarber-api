import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { appointment } = data;
    /**
     * Send a mail to provider, using the cancellation template.
     * The template is on src\app\views\cancellation.hbs
     */
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Appointment canceled',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(parseISO(appointment.date), "MMMM dd', at' H:mm'h'", {
          locale: pt,
        }),
      },
    });
  }
}

export default new CancellationMail();
