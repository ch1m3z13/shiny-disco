const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false, 
   // dialectOptions: {
     // ssl: {
       // require: true, 
       // rejectUnauthorized: true 
     // }
   // }
  });
} else {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: true,
      //  dialectOptions: {
        //  ssl: {
           // require: false,
        //    rejectUnauthorized: false
        //  }
      //  }
      });
}

module.exports = sequelize;