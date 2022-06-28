'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("order_places", [
      {
        quantity_to_deliver: 5,
        placeId: 1,
        orderUuid: 'd2bfc481-a9cf-473c-a6ce-501379fb2cfc'
      },
      {
        quantity_to_deliver: 12,
        placeId: 2,
        orderUuid: 'd2bfc481-a9cf-473c-a6ce-501379fb2cfc'
      },
      {
        quantity_to_deliver: 8,
        placeId: 3,
        orderUuid: 'd2bfc481-a9cf-473c-a6ce-501379fb2cfc'
      },
      // order 2
      {
        quantity_to_deliver: 35,
        placeId: 7,
        orderUuid: 'c5ee7f92-b59a-4bea-a208-582e579e075d'
      },
      {
        quantity_to_deliver: 11,
        placeId: 8,
        orderUuid: 'c5ee7f92-b59a-4bea-a208-582e579e075d'
      },
      // order 3
      {
        quantity_to_deliver: 8,
        placeId: 8,
        orderUuid: 'c4305e09-1b4d-46a9-9bbe-95dd4cf6f916'
      },
      {
        quantity_to_deliver: 4,
        placeId: 9,
        orderUuid: 'c4305e09-1b4d-46a9-9bbe-95dd4cf6f916'
      },
      {
        quantity_to_deliver: 6,
        placeId: 10,
        orderUuid: 'c4305e09-1b4d-46a9-9bbe-95dd4cf6f916'
      },
      // order 4
      {
        quantity_to_deliver: 15,
        placeId: 4,
        orderUuid: 'ea504722-5620-492a-b012-80f3185de51d'
      },
      {
        quantity_to_deliver: 15,
        placeId: 5,
        orderUuid: 'ea504722-5620-492a-b012-80f3185de51d'
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('order_places', null, {});
  }
};
