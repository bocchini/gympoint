import * as Yup from 'yup';
import { addMonths, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt';

// Models
import GestaoMatriculas from '../models/GestaoMatriculas';
import User from '../models/User';
import Student from '../models/Students';
import Planos from '../models/Planos';

import Mail from '../../lib/Mail';

class ManagementEnrollmentController {
  async store(req, res) {
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (!isProvider) {
      return res.status(401).json({ error: 'Register is ever for provider' });
    }
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation errors' });
    }
    /**
     * Student exists
     * */

    const student = await Student.findByPk(req.body.student_id);
    if (student === null) {
      return res.status(400).json({ error: 'Estudante not exists' });
    }

    /**
     * Plan exists
     */
    const plan = await Planos.findByPk(req.body.plan_id);
    if (plan === null) {
      return res.status(400).json({ error: 'Plano not exists' });
    }

    /**
     * Check for past dates
     */
    const date = new Date(req.body.start_date);
    if (isBefore(date, new Date())) {
      return res.status(400).json({ Error: 'Post dates are not permitted' });
    }

    /**
     * Check student is plan
     */
    const studentPlanExits = await GestaoMatriculas.findOne({
      where: {
        student_id: student.id,
      },
    });

    if (studentPlanExits !== null) {
      return res.status(400).json({ Error: 'Student is plan' });
    }

    /**
     *  Add Mounths in end date the plan
     */
    req.body.end_date = addMonths(date, plan.duration);

    /**
     * Calculate values to plan
     */
    req.body.price = plan.duration * plan.price;

    const {
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    } = await GestaoMatriculas.create(req.body);

    // SendMail
    await Mail.sendMail({
      to: `${student.nome} <${student.email}>`,
      subject: 'Inscrição feita com sucesso',
      template: 'registration',
      context: {
        name: student.nome,
        plan_title: plan.title,
        duration: plan.duration,
        start: format(start_date, " dd'/'MM'/'yy", { locale: pt }),
        end: format(end_date, " dd'/'MM'/'yy", { locale: pt }),
        value: price,
      },
    });

    return res.json({
      student_id,
      name: student.nome,
      plan_id,
      start_date,
      end_date,
      price,
    });
  }

  async index(req, res) {
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (!isProvider) {
      return res.status(401).json({ error: 'Register is ever for provider' });
    }
    const { page } = req.query;
    const registation = await GestaoMatriculas.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['nome', 'email'],
        },
      ],
    });
    return res.json(registation);
  }

  async update(req, res) {
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (!isProvider) {
      return res.status(401).json({ error: 'Register is ever for provider ' });
    }
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .required(),
      plan_id: Yup.number().integer(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ Error: 'Validation errors' });
    }

    const matricula = await GestaoMatriculas.findOne({
      were: {
        student_id: req.body.student_id,
      },
    });
    if (!matricula) {
      return res.status(400).json({ error: 'Registration not exists' });
    }

    if (req.body.plan_id) {
      const plan = await Planos.findByPk(req.body.plan_id);
      if (!plan) {
        return res.status(400).json({ error: 'Plan not exists' });
      }
      if (req.body.start_date) {
        req.body.end_date = addMonths(
          new Date(req.body.start_date),
          plan.duration
        );
      } else {
        req.body.end_date = addMonths(matricula.start_date, plan.duration);
      }
      req.body.price = plan.price * plan.duration;
    } else if (req.body.start_date) {
      const plan = await Planos.findByPk(matricula.plan_id);
      req.body.end_date = addMonths(
        new Date(req.body.start_date),
        plan.duration
      );
    }

    const {
      id,
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    } = await matricula.update(req.body);
    return res.json({
      id,
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });
  }

  async delete(req, res) {
    const isProvider = User.findOne({
      where: {
        id: req.userId,
        provider: true,
      },
    });
    if (!isProvider) {
      res.status(401).json({ Error: 'This function is only provider' });
    }
    const matricula = await GestaoMatriculas.findByPk(req.params.id);
    if (matricula === null) {
      return res.status(400).json({ Error: 'Registration not exists' });
    }
    matricula.destroy();
    return res.json({ Delete: 'ok' });
  }
}

export default new ManagementEnrollmentController();
