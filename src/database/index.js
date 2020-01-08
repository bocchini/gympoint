// Arquivo de conexão com o BD

import Sequelize from 'sequelize';

import dataBaseConfig from '../config/database';

// Models
import User from '../app/models/User';
import Students from '../app/models/Students';
import Planos from '../app/models/Planos';
import GestaoMatriculas from '../app/models/GestaoMatriculas';

const models = [User, Students, Planos, GestaoMatriculas];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(dataBaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
