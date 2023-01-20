import sequelizeConnection from "./config";

const db = () => Promise.all([
    sequelizeConnection.sync()
]);

export default db 