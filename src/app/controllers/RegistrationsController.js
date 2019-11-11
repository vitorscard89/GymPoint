import * as Yup from 'yup';
import { isBefore, startOfDay, parseISO, addMonths } from 'date-fns';

import Plan from '../models/Plan';
import Student from '../models/Student';
import Registration from '../models/Registration';

class RegistrationsController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const registration = await Registration.findAll({
      order: ['id'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'start_date', 'end_date', 'price'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });
    return res.json(registration);
  }

  async show(req, res) {
    const { page = 1 } = req.query;

    const registration = await Registration.findAll({
      where: { student_id: req.params.id },
      order: ['created_at'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'start_date', 'end_date', 'price'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });
    return res.json(registration);
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

    await Registration.create({
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

    return res.json({
      student_id,
      plan_id,
      start_date: dayStart,
      end_date,
      price,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { plan_id, start_date } = req.body;

    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan not exists' });
    }

    const registration = await Registration.findByPk(req.params.id);

    const dayStart = startOfDay(parseISO(start_date));

    if (isBefore(dayStart, startOfDay(registration.start_date))) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    await registration.update({
      plan_id,
      start_date: dayStart,
      end_date: addMonths(dayStart, plan.duration),
      price: plan.price * plan.duration,
    });

    return res.json(registration);
  }

  async delete(req, res) {
    return res.json({ ok: true });
  }
}
export default new RegistrationsController();
