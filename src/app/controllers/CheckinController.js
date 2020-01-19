import { startOfDay, subDays } from 'date-fns';

import Checkins from '../schemas/Checkins';
import GestaoMatriculas from '../models/GestaoMatriculas';

class CheckinController {
  async store(req, res) {
    // Verify student exists in Plan
    const existsPlanStudent = await GestaoMatriculas.findOne({
      where: {
        student_id: req.params.id,
      },
    });

    if (!existsPlanStudent) {
      return res.status(400).json({ Error: 'Student don´t have a plan' });
    }

    if (startOfDay(existsPlanStudent.end_date) <= startOfDay(new Date())) {
      return res.status(400).json({ Error: 'Student don´t have a plan valid' });
    }

    // Verify if student do checkin today
    const startDate = subDays(new Date(), 5);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const consultCheckin = await Checkins.find({
      student_id: req.params.id,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    if (consultCheckin) {
      // Verify Sudent do checkin today
      const today = consultCheckin.filter(p => {
        return startOfDay(p.createdAt) >= startOfDay(endDate);
      });

      if (today.length >= 1) {
        return res.json({ Ok: 'Student do checkin today' });
      }
      // Verify Student do checkin more 5 consecutives
      const resultHowMuchCheckin = consultCheckin.filter(p => {
        return (
          startOfDay(p.createdAt) >= startOfDay(startDate) &&
          startOfDay(p.createdAt) <= startOfDay(endDate)
        );
      });
      if (resultHowMuchCheckin.length >= 5) {
        return res.json({
          Error: 'Student have more 5 checkins consecutives',
        });
      }
    }
    const checkin = await Checkins.create({
      student_id: req.params.id,
      createdAt: startOfDay(new Date()),
    });
    return res.json(checkin);
  }

  async index(req, res) {
    // const { page } = req.query;
    const checkin = await Checkins.find({
      student_id: req.params.id,
    })
      .sort('created_at')
      .limit(20);
    return res.json(checkin);
  }
}

export default new CheckinController();
