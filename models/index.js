//const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const dotenv = require('dotenv');
dotenv.config();
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PWD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
          require: true, 
          rejectUnauthorized: false 
        }
      },

});

console.log(process.env.DB_CONNECTION_STRING);
// const sequelize = new Sequelize({
//     connectionString: process.env.DB_CONNECTION_STRING,
//     ssl: {
//         rejectUnauthorized: false
//     }
// })


const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.events = require("./event")(sequelize, Sequelize);
db.participants = require("./participant")(sequelize, Sequelize);
db.participantEvents = require("./participant_event")(sequelize, Sequelize);
db.venues = require('./venue')(sequelize, Sequelize);
db.checkins=require('./checkin')(sequelize,Sequelize);

db.participants.belongsToMany(db.events, { through: db.participantEvents, foreignKey: 'pid' });
db.events.belongsToMany(db.participants, { through: db.participantEvents, foreignKey: 'eid' })
db.participantEvents.belongsTo(db.events, { foreignKey: 'eid' })
db.participantEvents.belongsTo(db.participants, { foreignKey: 'pid' })


db.events.hasOne(db.venues, { foreignKey: 'vid' })



module.exports = db;