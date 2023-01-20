import { Model, DataTypes } from "sequelize"
import sequelizeConnection from "../config";
import Courses from "./courses";
import Lecturer from "./lecturer";


class Announcement extends Model {
    [x: string]: any;
};

Announcement.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: sequelizeConnection,
    paranoid: false
});

Announcement.belongsTo(Courses, { foreignKey: 'course_id' });
Announcement.belongsTo(Lecturer, { foreignKey: 'lecturer_id' })
export default Announcement;