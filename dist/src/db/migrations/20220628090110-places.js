'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('places', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      area: {
        type: Sequelize.STRING,
        allowNull: false
      },
      coords: {
        type: Sequelize.GEOMETRY('POINT'),
        allowNull: false
      }
    });

  },

  async down(queryInterface, Sequelize) {
    
    await queryInterface.dropTable('places');
    
  }
};
