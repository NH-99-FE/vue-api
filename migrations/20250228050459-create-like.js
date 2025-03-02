'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Likes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      courseId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addIndex(
        'Likes', {
          fields: ['courseId'],
        }
    );
    await queryInterface.addIndex(
        'Likes', {
          fields: ['userId'],
        }
    )
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Likes');
  }
};