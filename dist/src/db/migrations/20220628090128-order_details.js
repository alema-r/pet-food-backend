'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_details', {
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      withdrawal_order: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.dropTable('order_details');

  }
};
