'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          is: /^[0,1,2,3]{1}$/
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};
