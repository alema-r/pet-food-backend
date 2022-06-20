'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('places', [
      {
        name: "Deliver Place 1",
        area: "Ancona",
        coords: Sequelize.fn('ST_GeomFromGeoJSON', JSON.stringify({type: 'Point', coordinates: [43.545121, 13.509598]})),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Deliver Place 2",
        area: "Ancona",
        coords: Sequelize.fn('ST_GeomFromGeoJSON', JSON.stringify({type: 'Point', coordinates: [43.546000, 13.509652]})),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Deliver Place 3",
        area: "Ancona",
        coords: Sequelize.fn('ST_GeomFromGeoJSON', JSON.stringify({type: 'Point', coordinates: [43.547582, 13.509738]})),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Deliver Place 4",
        area: "Ancona",
        coords: Sequelize.fn('ST_GeomFromGeoJSON', JSON.stringify({type: 'Point', coordinates: [43.549671, 13.509908]})),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Deliver Place 5",
        area: "Ancona",
        coords: Sequelize.fn('ST_GeomFromGeoJSON', JSON.stringify({type: 'Point', coordinates: [43.551137, 13.510026]})),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Deliver Place 6",
        area: "Ancona",
        coords: Sequelize.fn('ST_GeomFromGeoJSON', JSON.stringify({type: 'Point', coordinates: [43.552091, 13.510037]})),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Deliver Place 7",
        area: "Piediripa",
        coords: Sequelize.fn('ST_GeomFromGeoJSON', JSON.stringify({type: 'Point', coordinates: [43.274738, 13.490619]})),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Deliver Place 8",
        area: "Piediripa",
        coords: Sequelize.fn('ST_GeomFromGeoJSON', JSON.stringify({type: 'Point', coordinates: [43.274773, 13.491814]})),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Deliver Place 9",
        area: "Piediripa",
        coords: Sequelize.fn('ST_GeomFromGeoJSON', JSON.stringify({type: 'Point', coordinates: [43.274873, 13.492574]})),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Deliver Place 10",
        area: "Piediripa",
        coords: Sequelize.fn('ST_GeomFromGeoJSON', JSON.stringify({type: 'Point', coordinates: [43.275115, 13.494532]})),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('places', null, {});    
  }
};
