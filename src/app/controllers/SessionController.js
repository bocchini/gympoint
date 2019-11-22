import jwt from 'jsonwebtoken';

import User from '../models/User';
import AuthConfig from '../../config/auth';

require('dotenv/config');

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ Error: 'User or password not match' });
    }
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'User or password not match' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, process.env.APP_SECRET, {
        expiresIn: AuthConfig.expires,
      }),
    });
  }
}

export default new SessionController();
