import { DataTypes, Model } from 'sequelize';
import sequelizeConnection from '../config';

class Fakulty extends Model {
  [x: string]: any;
};


Fakulty.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    sequelize: sequelizeConnection,
    paranoid: false,
    timestamps: false,
});
export default Fakulty