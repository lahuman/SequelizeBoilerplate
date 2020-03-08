const { Sequelize } = require('sequelize');
const Model = Sequelize.Model;

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});


class User extends Model { }

User.init({
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: Sequelize.STRING(32),
  age: Sequelize.INTEGER,
}, { sequelize, modelName: 'user', tableName: 'user' });


class Project extends Model { }

Project.init({
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: {
    type: Sequelize.INTEGER,

    references: {
      // This is a reference to another model
      model: User,
      // This is the column name of the referenced model
      key: 'id',
    }
  },
  name: Sequelize.STRING(128),
}, { sequelize, modelName: 'project', tableName: 'project' });


User.hasMany(Project, { foreignKey: 'user_id', sourceKey: 'id' });
Project.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

//create table
sequelize.sync();

module.exports = {
  sequelize,
  User,
  Project
};