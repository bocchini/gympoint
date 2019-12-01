// Arquivo de conexão com o BD

import Sequelize from 'sequelize';

import dataBaseConfig from '../config/database';

// Models
import User from '../app/models/User';
import Students from '../app/models/Students';

const models = [User, Students];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(dataBaseConfig);
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
