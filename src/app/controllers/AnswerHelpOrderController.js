import * as Yup from 'yup';

import HelpOrders from '../schemas/HelpOrders';

import Mail from '../../lib/Mail';
import Students from '../models/Students';

class AnserHelpOrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ Error: 'Validation errors' });
    }

    const answerQuestion = await HelpOrders.findByIdAndUpdate(req.params.id, {
      answer: req.body.answer,
      answer_at: new Date(),
    });

    const { nome, email } = await Students.findByPk(answerQuestion.student_id);

    // Send Email
    await Mail.sendMail({
      to: `${nome} <${email}>`,
      subject: 'Sua pergunta foi respondida',
      template: 'answerQuestion',
      context: {
        name: nome,
        question: answerQuestion.question,
        answer: answerQuestion.answer,
        date_answer: answerQuestion.answer_at,
      },
    });
    return res.json(answerQuestion);
  }

  async index(req, res) {
    const noAnswerQuestions = await HelpOrders.find({ answer: null });
    return res.json(noAnswerQuestions);
  }
}

export default new AnserHelpOrderController();
