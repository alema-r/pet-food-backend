'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("orders", [
      {
        uuid: 'd2bfc481-a9cf-473c-a6ce-501379fb2cfc',
        status: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 2
      },
      {
        uuid: 'c5ee7f92-b59a-4bea-a208-582e579e075d',
        status: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 3
      },
      {
        uuid: 'c4305e09-1b4d-46a9-9bbe-95dd4cf6f916',
        status: 1, //failed
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 2
      },
      {
        uuid: 'ea504722-5620-492a-b012-80f3185de51d',
        status: 3, //completed
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 3
      },
    ])
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('orders', null, {});

  }
};
