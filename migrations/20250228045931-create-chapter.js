'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Chapters', {
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
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      context: {
        type: Sequelize.TEXT
      },
      video: {
        type: Sequelize.STRING,
      },
      rank: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 1,
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
        'Chapters', {
          fields: ['courseId']
        }
    )
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Chapters');
  }
};