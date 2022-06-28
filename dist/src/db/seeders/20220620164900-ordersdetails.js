'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("order_details", [
      //order 1
      {
        quantity: 10,
        withdrawal_order: 1,
        foodId: 1,
        orderUuid: 'd2bfc481-a9cf-473c-a6ce-501379fb2cfc'
      },
      {
        quantity: 15,
        withdrawal_order: 2,
        foodId: 4,
        orderUuid: 'd2bfc481-a9cf-473c-a6ce-501379fb2cfc'
      },
      //order 2
      {
        quantity: 23,
        withdrawal_order: 1,
        foodId: 2,
        orderUuid: 'c5ee7f92-b59a-4bea-a208-582e579e075d'
      },
      {
        quantity: 11,
        withdrawal_order: 2,
        foodId: 5,
        orderUuid: 'c5ee7f92-b59a-4bea-a208-582e579e075d'
      },
      {
        quantity: 12,
        withdrawal_order: 3,
        foodId: 7,
        orderUuid: 'c5ee7f92-b59a-4bea-a208-582e579e075d'
      },
      //order 3
      {
        quantity: 10,
        withdrawal_order: 2,
        foodId: 6,
        orderUuid: 'c4305e09-1b4d-46a9-9bbe-95dd4cf6f916'
      },
      {
        quantity: 8,
        withdrawal_order: 1,
        foodId: 1,
        orderUuid: 'c4305e09-1b4d-46a9-9bbe-95dd4cf6f916'
      },
      //order 4
      {
        quantity: 20,
        withdrawal_order: 1,
        foodId: 3,
        orderUuid: 'ea504722-5620-492a-b012-80f3185de51d'
      },
      {
        quantity: 10,
        withdrawal_order: 2,
        foodId: 1,
        orderUuid: 'ea504722-5620-492a-b012-80f3185de51d'
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('order_details', null, {});

  }
};
