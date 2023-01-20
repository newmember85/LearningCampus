import { Sequelize } from 'sequelize'


const sequelizeConnection = new Sequelize('learningcampus', 'root', 'test', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
sequelizeConnection.Sequelize = Sequelize


export default sequelizeConnection