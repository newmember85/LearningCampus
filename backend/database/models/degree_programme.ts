import { DataTypes, Model } from 'sequelize';
import sequelizeConnection from '../config';
import Fakulty from './faculty';

class DegreeProgramme extends Model {
    [x: string]: any;
};

DegreeProgramme.init({
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
    semester_count: {
        type: DataTypes.INTEGER
    },
    splan_id: {
        type: DataTypes.INTEGER
    }
}, {
    sequelize: sequelizeConnection,
    paranoid: false,
    timestamps: false,
    modelName: 'DegreeProgramme'
});

DegreeProgramme.belongsTo(Fakulty, { foreignKey: 'fakulty_id' });

export default DegreeProgramme