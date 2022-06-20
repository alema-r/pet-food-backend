'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      username: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      role: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        validate: {
          is: /^[0,1]{1}$/
        }
      },
      password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
