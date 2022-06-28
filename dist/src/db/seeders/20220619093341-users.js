'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        role: 0,
        password: await bcrypt.hash("AdminPass", 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "testUser",
        role: 1,
        password: await bcrypt.hash("UserPass", 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "testUser2",
        role: 1,
        password: await bcrypt.hash("UserPass", 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
