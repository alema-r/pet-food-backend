'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('food', [
      {
        name: "Rice",
      },
      {
        name: "Chicken",
      },
      {
        name: "Salmon",
      },
      {
        name: "Tuna",
      },
      {
        name: "Vegetables",
      },
      {
        name: "Rabbit",
      },
      {
        name: "Beef",
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('food', null, {});
  }
};
