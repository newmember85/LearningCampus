import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../config';
import Courses from './courses';
import bcrypt from 'bcryptjs'
import DegreeProgramme from './degree_programme';
class Student extends Model {
    [x: string]: any;
};


Student.init({
    matrikel_nr: {
        type: DataTypes.INTEGER,
        autoIncrement: false,
        primaryKey: true,
        allowNull: false,
        get() {
            return this.getDataValue('matrikel_nr')
        },
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return this.getDataValue('surname')
        },
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
    {
        sequelize: sequelizeConnection,
        paranoid: false,
        timestamps: false,
        hooks: {
            beforeCreate: (user, options) => {
                {
                    user.password = user.password && user.password != "" ? bcrypt.hashSync(user.password, 10) : "";
                }
            },
            beforeUpdate: (user, options) => {
                {
                    user.password = user.password && user.password != "" ? bcrypt.hashSync(user.password, 10) : "";
                }
            }
        }
    });
Student.belongsToMany(Courses, { through: 'Course_Enrollment' });
Courses.belongsToMany(Student, { through: 'Course_Enrollment' });

Student.belongsTo(DegreeProgramme, { foreignKey: 'degree_id' });

export default Student