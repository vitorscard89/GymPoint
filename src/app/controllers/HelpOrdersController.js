import * as Yup from 'yup';
import Queue from '../../lib/Queue';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import AnswerMail from '../jobs/AnswerMail';

class HelpOrdersController {
  async index(req, res) {
    const helpOrder = await HelpOrder.findAll({
      where: {
        answer: null,
      },
    });
    return res.json(helpOrder);
  }

  async show(req, res) {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }
    const helpOrders = await HelpOrder.findAll({
      where: { student_id: req.params.id },
    });
    return res.json(helpOrders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });
    if (!(await schema.validate(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const { question, answer } = await HelpOrder.create({
      student_id: student.id,
      question: req.body.question,
    });
    return res.json({ question, answer });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });
    if (!(await schema.validate(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }
    const helpOrder = await HelpOrder.findByPk(req.params.id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    const { id, question, answer, answer_at } = await helpOrder.update({
      answer: req.body.answer,
      answer_at: new Date(),
    });

    await Queue.add(AnswerMail.key, {
      helpOrder,
    });

    return res.json({ id, question, answer, answer_at });
  }
}

export default new HelpOrdersController();
