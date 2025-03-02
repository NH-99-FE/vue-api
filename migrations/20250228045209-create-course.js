'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Courses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      categoryId: {
        type: Sequelize.INTEGER.UNSIGNED
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      recommended: {
        type: Sequelize.BOOLEAN
      },
      introductory: {
        type: Sequelize.BOOLEAN
      },
      context: {
        type: Sequelize.TEXT
      },
      likesCount: {
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 0
      },
      chaptersCount: {
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 0
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
        'Courses', {
          fields: ['categoryId']
        });
    await queryInterface.addIndex(
        'Courses', {
          fields: ['userId']
        });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Courses');
  }
};