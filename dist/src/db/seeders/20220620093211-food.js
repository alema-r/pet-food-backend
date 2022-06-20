'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('food', [
      {
        name: 'Rice',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Chicken",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Salmon",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Tuna",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Vegetables",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Rabbit",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Beef",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('food', null, {});
  }
};
