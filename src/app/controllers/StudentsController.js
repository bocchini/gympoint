import * as Yup from 'yup';

import Students from '../models/Students';
import User from '../models/User';

class StudentsController {
  async store(req, res) {
    const { provider } = await User.findOne({ where: { id: req.userId } });
    if (provider === false) {
      return res.status(401).json({ error: 'Register is ever for provider ' });
    }

    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      idade: Yup.number()
        .positive()
        .integer()
        .max(150)
        .required(),
      peso: Yup.number()
        .max(1000)
        .min(0.001)
        .required(),
      altura: Yup.number()
        .max(3)
        .min(0.03)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { id, nome, email, idade, peso, altura } = await Students.create(
      req.body
    );
    return res.json({ id, nome, email, idade, peso, altura });
  }

  async update(req, res) {
    const studentsUpdate = req.body;
    const stundets = await Students.findByPk(studentsUpdate.id);

    if (stundets === null) {
      return res.status(400).json({ error: 'Student not exists' });
    }
    const schema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .min(1)
        .required(),
      nome: Yup.string(),
      email: Yup.string().email(),
      idade: Yup.number()
        .min(1)
        .integer()
        .max(150),
      peso: Yup.number()
        .max(1000)
        .min(0.001),
      altura: Yup.number()
        .max(3)
        .min(0.03),
    });
    if (!(await schema.isValid(studentsUpdate))) {
      return res.status(400).json({ error: 'Validation errors' });
    }
    const { id, nome, email, idade, peso, altura } = await stundets.update(
      req.body
    );
    return res.json({ id, nome, email, idade, peso, altura });
  }
}

export default new StudentsController();
