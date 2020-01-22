import * as Yup from 'yup';
import { startOfDay } from 'date-fns';

import HelpOrder from '../schemas/HelpOrders';
import Management from '../models/GestaoMatriculas';

class HelpOrderController {
  async store(req, res) {
    req.body.student_id = req.params.id;
    const schema = Yup.object().shape({
      student_id: Yup.number(),
      question: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ Error: 'Validation errors' });
    }
    const validPlan = await Management.findOne({
      where: {
        student_id: req.params.id,
      },
    });

    if (!validPlan) {
      return res.status(401).json({ Error: 'Do you have a plan valid' });
    }

    if (startOfDay(validPlan.end_date) > startOfDay(new Date())) {
      return res.status(401).json({ Error: 'Your plan isn´t valid' });
    }

    const helpOrder = await HelpOrder.create(req.body);
    return res.json(helpOrder);
  }

  async index(req, res) {
    const helpStudent = await HelpOrder.find({
      student_id: req.params.id,
      answer_at: null,
    });

    return res.json(helpStudent);
  }
}

export default new HelpOrderController();
