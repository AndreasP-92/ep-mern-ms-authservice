import Sequelize from 'sequelize';
import user from '../model/user.js';
import userRoles from '../model/userRoles.js';
import dotenv from 'dotenv';
dotenv.config();

let ssl = process.env.ENVIRONMENT == "dev" ? false : true;
let mysqlHost = process.env.ENVIRONMENT == "dev" ? process.env.DEV_MYSQL_HOST : process.env.MYSQL_HOST;
let mysqlPort = process.env.ENVIRONMENT == "dev" ? process.env.DEV_MYSQL_PORT : process.env.MYSQL_PORT;
let mysqlUser = process.env.ENVIRONMENT == "dev" ? process.env.DEV_MYSQL_USER : process.env.MYSQL_USER;
let mysqlPass = process.env.ENVIRONMENT == "dev" ? process.env.DEV_MYSQL_PASS : process.env.MYSQL_PASS;
let MySQLDB = process.env.ENVIRONMENT == "dev" ? process.env.DEV_MYSQL_DB : process.env.MYSQL_DB;

console.log(mysqlHost)

let sequelize = new Sequelize(MySQLDB, mysqlUser, mysqlPass, {
    host: mysqlHost,
    port: mysqlPort,
    dialect: 'mysql',
    operatorsAliases: 0,
    dialectOptions: {
      ssl: {
         require: ssl,
         rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
});


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.userRoles = userRoles(sequelize, Sequelize);
db.users = user(sequelize, Sequelize);

// db.users = require("../model/user")(sequelize, Sequelize);


// Syncs all of the tables >> WARNING << exclude this from production, or create migrations instead, as it deletes all rows and create new ones
// sequelize.sync({ force: true }).then(() => {
//   console.log('Tables have been created!');
// });

// Resaerch more, as it doesn't auto generate from models ==>
// More safe methods are migrations:
// 1. npm install -g sequelize-cli
// 2. npm install mysql2 --global    
// 3. sequelize init       
// 4. Go to config/config.json and set up connection to db
// 5. npx sequelize-cli migration:generate --name create-users-table
// 6. npx sequelize-cli db:migrate
// Note, if you're running es6 or "type" : "module" in package.json, migration extensions should be .cjs in /migrations

export default db;
