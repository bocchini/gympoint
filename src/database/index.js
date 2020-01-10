// Arquivo de conexão com o BD
import Sequelize from 'sequelize';
import mongoose from 'mongoose';
require('dotenv/config');

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
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(dataBaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    });
  }
}

export default new Database();
