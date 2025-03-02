'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Settings',[{
      name: '前端开发',
      icp: '鄂ICP备13016268号-11',
      copyright: '@ 2013 vue Inc. All Rights Reserved.',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Settings', {
      name: '前端开发'
    });
  }
};
