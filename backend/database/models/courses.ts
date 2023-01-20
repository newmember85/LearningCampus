import { Model, DataTypes } from "sequelize"
import sequelizeConnection from "../config";
import DegreeProgramme from "./degree_programme";


class Courses extends Model {
  [x: string]: any;
};

Courses.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    abbreviation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    semester: {
        type: DataTypes.INTEGER
    },
    is_fwpm: {
        type: DataTypes.BOOLEAN
    }
}, {
    sequelize: sequelizeConnection,
    paranoid: false,
    timestamps: false,
    modelName: 'Course'
});

Courses.belongsTo(DegreeProgramme, { foreignKey: 'degreeProgramme_id' });


export default Courses;