import * as Yup from 'yup';

import Planos from '../models/Planos';
import User from '../models/User';

class PlanosController {
  async index(req, res) {
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (!isProvider) {
      return res.status(401).json({ error: 'Register is ever for provider' });
    }
    const planos = await Planos.findAll({ limit: 20 });
    return res.json(planos);
  }

  async store(req, res) {
    const { provider } = await User.findOne({ where: { id: req.userId } });

    if (!provider) {
      return res.status(401).json({ error: 'Register is ever for provider' });
    }
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .integer()
        .required(),
      price: Yup.number()
        .integer()
        .min(0.01)
        .required(),
    });

    if (!schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validations Fail' });
    }

    const { id, title, duration, price } = await Planos.create(req.body);
    return res.json({ id, title, duration, price });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .min(1)
        .required(),
      title: Yup.string(),
      duration: Yup.number().integer(),
      price: Yup.number()
        .positive()
        .min(0.01),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation errors' });
    }

    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (!isProvider) {
      return res.status(401).json({ error: 'Register is ever for provider' });
    }

    const planos = await Planos.findByPk(req.body.id);
    if (planos === null) {
      return res.status(400).json({ error: 'Plano not exists' });
    }
    const { id, title, duration, price } = await planos.update(req.body);
    return res.json({ id, title, duration, price });
  }

  async delete(req, res) {
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (!isProvider) {
      return res.status(401).json({ error: 'Register is ever for provider' });
    }
    const planos = await Planos.findByPk(req.params.id);
    if (planos === null) {
      return res.status(400).json({ error: 'Plano not exists' });
    }
    planos.destroy();
    return res.json({ Delete: 'ok' });
  }
}

export default new PlanosController();
