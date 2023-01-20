import { Model, DataTypes } from "sequelize"
import sequelizeConnection from "../config";
import Courses from "./courses";


class CourseContent extends Model {
    [x: string]: any;
};

CourseContent.init({
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
    },
    content_type: {
        type: DataTypes.STRING
    },
    url_path: {
        type: DataTypes.STRING
    }
}, {
    sequelize: sequelizeConnection,
    paranoid: false
});

CourseContent.belongsTo(Courses, { foreignKey: 'course_id' });

export default CourseContent;