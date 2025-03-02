'use strict';
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        email: 'admin@gmail.com',
        username: 'admin',
        password: bcrypt.hashSync('123456',10),
        nickname: '前端管理员',
        sex: 2,
        role: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'user1@gmail.com',
        username: 'zhangsan',
        password: bcrypt.hashSync('123456',10),
        nickname: '你大爷张三',
        sex: 0,
        role: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'user2@gmail.com',
        username: 'lisi',
        password: bcrypt.hashSync('123456',10),
        nickname: '你二大爷李四',
        sex: 0,
        role: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      username: ['admin', 'zhangsan', 'lisi'],
    })
  }
};
