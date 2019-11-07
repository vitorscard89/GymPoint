import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      idade: Yup.number(),
      peso: Yup.number(),
      altura: Yup.number(),
    });
    if (!(await schema.validate(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const students = await Student.findOne({
      where: { email: req.body.email },
    });
    if (students) {
      return res.status(400).json({ error: 'Student already exists!' });
    }

    const student = await Student.create(req.body);

    return res.json({ student });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      idade: Yup.number(),
      peso: Yup.number(),
      altura: Yup.number(),
    });

    if (!(await schema.validate(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }
    const student = await Student.update(req.body);

    return res.json(student);
  }
}

export default new StudentController();
