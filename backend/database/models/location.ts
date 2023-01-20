import { Model, DataTypes } from "sequelize"
import sequelizeConnection from "../config";


class Location extends Model {
    [x: string]: any;
};

Location.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    way_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    building: {
        type: DataTypes.STRING,
        allowNull: false
    },
    level: {
        type: DataTypes.STRING,
        allowNull: false
    },
    room: {
        type: DataTypes.STRING,
        allowNull: false
    },
    shortname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    geometry: {
        type: DataTypes.GEOMETRY('POINT'),
    }
}, {
    sequelize: sequelizeConnection,
    paranoid: false
});

export default Location;