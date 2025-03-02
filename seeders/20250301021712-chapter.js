'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Chapters', [
      {
        courseId: 1,
        title: 'CSS由浅入深',
        context: 'CSS的全名是层叠样式表。官方的解释，我就不细说了，因为就算细说了对新手朋友们来说，听得还是一脸懵逼。那我们就用最通俗的说法来讲，到底啥是CSS?',
        video: '',
        rank: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        courseId: 2,
        title: 'JavaScript基础入门',
        context: 'JavaScript是一种广泛用于客户端网页开发的脚本语言，常用来为网页添加各式各样的动态功能。你将学习如何使用它来构建互动式的网页。',
        video: '',
        rank: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        courseId: 3,
        title: 'HTML5从新手到高手',
        context: 'HTML5是HTML的最新版本，它不仅仅是一种标记语言，更是一个包含了多种技术的平台。在这个课程中，你将学到如何使用HTML5创建现代化的网站。',
        video: '',
        rank: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        courseId: 4,
        title: '前端框架React速成',
        context: 'React是由Facebook开发的一个JavaScript库，用于构建用户界面。本课程将带你快速入门React的基础知识和核心概念。',
        video: '',
        rank: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        courseId: 5,
        title: 'Python编程入门指南',
        context: 'Python是一种高级编程语言，因其代码的可读性和简洁性而广受欢迎。在本课程中，你将学习Python的基本语法以及如何编写简单的程序。',
        video: '',
        rank: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        courseId: 6,
        title: '数据库管理与SQL查询',
        context: '数据库是现代软件系统的核心组件之一。本课程将介绍数据库管理的基础知识，并教你如何使用SQL进行有效的数据库查询。',
        video: '',
        rank: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Chapters', null, {})
  }
};
