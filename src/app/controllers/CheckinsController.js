import {
  parseISO,
  isBefore,
  isAfter,
  subDays,
  startOfDay,
  endOfDay,
  addDays,
} from 'date-fns';
// import Checkins from '../models/Checkin';
import Students from '../models/Student';
import Registrations from '../models/Registration';

class CheckinsController {
  async index(req, res) {
    console.log(req.params.id);

    return res.json({ ok: true });
  }

  async store(req, res) {
    const student = await Students.findByPk(req.params.id);
    if (!student) {
      return res.status(400).json({ error: 'studen not exists' });
    }

    const { start_date, end_date } = await Registrations.findAll({
      where: { student_id: req.params.id },
    });

    const endDate = parseISO(end_date);
    if (isBefore(endDate, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }
    const startDate = parseISO(start_date);
    if (isAfter(startDate, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const today = startOfDay(new Date());
    const lastDayCheckin = subDays(today, 7);

    const checkins = await Checkins.find({
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

    await Checkins.create({
      student_id: req.params.id,
    });

    return res.status(200).json({ sucess: 'Chekin successfully performed' });
  }
}

export default new CheckinsController();
