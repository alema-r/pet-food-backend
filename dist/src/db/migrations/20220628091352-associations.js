'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'orders',
      'userId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );

    await queryInterface.addColumn(
      'order_places',
      'orderUuid',
      {
        type: Sequelize.UUID,
        references: {
          model: 'orders',
          key: 'uuid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );

    await queryInterface.addColumn(
      'order_places',
      'placeId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'places',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );

    await queryInterface.addColumn(
      'order_details',
      'orderUuid',
      {
        type: Sequelize.UUID,
        references: {
          model: 'orders',
          key: 'uuid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );

    await queryInterface.addColumn(
      'order_details',
      'foodId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'food',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'orders',
      'userId'
    );
    await queryInterface.removeColumn(
      'order_places',
      'orderUuid',
    );
    await queryInterface.removeColumn(
      'order_places',
      'placeId',
    );
    await queryInterface.removeColumn(
      'order_details',
      'orderUuid',
    );
    await queryInterface.removeColumn(
      'order_details',
      'foodId',
    );

  }
};
