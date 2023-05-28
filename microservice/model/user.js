import userRolesModel from './userRoles.js';

export default (sequelize, Sequelize) => {
    const Users = sequelize.define("users", {
      firstname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      zipcode: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      phone: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      login_time:{
        type: Sequelize.DATE,
        allowNull: true
      }
    },{
      paranoid: true
    });

    const UserRoles = userRolesModel(sequelize, Sequelize);
    const UserRolesUsers = sequelize.define('userRolesUsers', {});

    Users.belongsToMany(UserRoles, {through: UserRolesUsers});
    UserRoles.belongsToMany(Users, {through: UserRolesUsers})

    return Users
  
};