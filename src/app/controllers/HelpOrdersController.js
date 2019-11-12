class HelpOrdersController {
  async index(req, res) {
    return res.json({ ok: true });
  }

  async store(req, res) {
    return res.json();
  }

  async update(req, res) {
    return res.json();
  }
}

export default new HelpOrdersController();
