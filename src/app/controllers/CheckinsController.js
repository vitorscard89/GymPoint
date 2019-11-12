import {
  isBefore,
  isAfter,
  subDays,
  startOfDay,
  endOfDay,
  addDays,
} from 'date-fns';
import Checkin from '../Schemas/Checkin';
import Students from '../models/Student';
import Registrations from '../models/Registration';

class CheckinsController {
  async index(req, res) {
    const student = await Students.findByPk(req.params.id);
    if (!student) {
      return res.status(400).json({ error: 'studen not exists' });
    }

    const checkin = await Checkin.find({
      student_id: req.params.id,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(checkin);
  }

  async store(req, res) {
    const student = await Students.findByPk(req.params.id);
    if (!student) {
      return res.status(400).json({ error: 'studen not exists' });
    }

    const registration = await Registrations.findOne({
      where: { student_id: req.params.id },
    });
    if (isBefore(new Date(), registration.start_date)) {
      return res.status(400).json({ error: 'Date is before the start date' });
    }

    if (isAfter(new Date(), registration.end_date)) {
      return res.status(400).json({ error: 'Date is after the end date' });
    }

    const today = startOfDay(new Date());
    const lastDayCheckin = subDays(today, 7);

    const checkins = await Checkin.find({
      student_id: req.params.id,
    })
      .gte('createdAt', startOfDay(lastDayCheckin))
      .lte('createdAt', endOfDay(today))
      .countDocuments();

    if (checkins >= 5) {
      return res.status(400).json({
        error: `Limit exceeded, You can only do 5 check-ins every 7 days. Next checkin avaliable in ${addDays(
          lastDayCheckin,
          8
        )}`,
      });
    }

    await Checkin.create({
      student_id: req.params.id,
    });

    return res.status(200).json({ sucess: 'Chekin successfully performed' });
  }
}

export default new CheckinsController();
