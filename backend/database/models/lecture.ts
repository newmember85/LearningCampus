import { Model, DataTypes } from "sequelize"
import sequelizeConnection from "../config";
import Courses from "./courses";
import Lecturer from "./lecturer";
import Location from "./location";


class Lecture extends Model {
  [x: string]: any;
};

Lecture.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    time_range: {
        type: DataTypes.STRING,
        allowNull: false
    },
    day: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: sequelizeConnection,
    paranoid: false,
    timestamps: false,
    modelName: 'Lecture'
});

Lecture.belongsTo(Courses, { foreignKey: 'course_id' });
Lecture.belongsTo(Location,{ foreignKey: 'location_id' })
Lecture.belongsTo(Lecturer, { foreignKey: 'lecturer_id' });



export default Lecture;