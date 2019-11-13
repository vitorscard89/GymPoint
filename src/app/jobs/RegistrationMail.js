import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'registrationMail';
  }

  async handle({ data }) {
    const { student, plan, dayStart, end_date, price } = data;

    const formatteStart_Date = format(dayStart, "dd'/'MM'/'yyyy", {
      locale: pt,
    });
    const formatteEnd_Date = format(end_date, "dd'/'MM'/'yyyy", {
      locale: pt,
    });

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Cadastro de Matrícula',
      template: 'registration',
      context: {
        student: student.name,
        plan: plan.title,
        start_date: formatteStart_Date,
        end_date: formatteEnd_Date,
        price,
      },
    });
  }
}

export default new RegistrationMail();
