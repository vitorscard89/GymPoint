import * as Yup from 'yup';
import Plans from '../models/Plan';

class PlansController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const plans = await Plans.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'title', 'duration', 'price'],
    });
    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });
    if (!(await schema.validate(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }
    const planExists = await Plans.findOne({
      where: { title: req.body.title, price: req.body.price },
    });
    if (planExists) {
      return res.status(401).json({ error: 'Plan already Exists!' });
    }
    const { id, title, duration, price } = await Plans.create(req.body);
    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });
    if (!(await schema.validate(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }
    const plan = await Plans.findByPk(req.params.id);
    const { title, duration, price } = await plan.update(req.body);
    return res.json({ title, duration, price });
  }

  async delete(req, res) {
    return res.json();
  }
}

export default new PlansController();
