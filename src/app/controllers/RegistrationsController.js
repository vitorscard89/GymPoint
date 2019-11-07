import * as Yup from 'yup';
import { format } from 'date-fns';

import Plan from '../models/Plan';
import Student from '../models/Student';

class RegistrationsController {
  async index(req, res) {
    return res.json({ ok: true });
  }

  async store(req, res) {
    return res.json({ ok: true });
  }

  async update(req, res) {
    return res.json({ ok: true });
  }

  async delete(req, res) {
    return res.json({ ok: true });
  }
}
export default new RegistrationsController();
