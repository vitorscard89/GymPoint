import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'registrationMail';
  }

  async handle({ data }) {
    const { registration } = data;
    await Mail.sendMail({
      to: `${registration.provider.name} <${registration.provider.email}>`,
      subject: 'Matricula VCadastrada',
      template: 'registration',
      context: {
        provider: registration.provider.name,
        user: registration.user.name,
        date: format(
          parseISO(registration.date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new RegistrationMail();
