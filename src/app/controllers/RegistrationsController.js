import * as Yup from 'yup';
import { isBefore, startOfDay, parseISO, addMonths } from 'date-fns';

import Plan from '../models/Plan';
import Student from '../models/Student';
import Registration from '../models/Registration';

class RegistrationsController {
  async index(req, res) {
    return res.json({ ok: true });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student not exists' });
    }

    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan not exists' });
    }

    const dayStart = startOfDay(parseISO(start_date));
    const actualDate = new Date();

    if (isBefore(dayStart, startOfDay(actualDate))) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const studentsHasRegistration = await Registration.findOne({
      where: { student_id },
    });

    if (studentsHasRegistration) {
      return res
        .status(400)
        .json({ error: 'This student has a registration already' });
    }

    const end_date = addMonths(dayStart, plan.duration);
    const price = plan.price * plan.duration;

    const registration = await Registration.create({
      student_id,
      plan_id,
      start_date: dayStart,
      end_date,
      price,
    });

    // await Queue.add(RegistrationMail.key, {
    //   student,
    //   plan,
    //   registration,
    // });

    return res.json(registration);
  }

  async update(req, res) {
    return res.json({ ok: true });
  }

  async delete(req, res) {
    return res.json({ ok: true });
  }
}
export default new RegistrationsController();
