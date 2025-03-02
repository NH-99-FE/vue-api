const express = require('express');
const router = express.Router();
const { Course, Category, User } = require('../models');
const { success, failure } = require('../utils/responses');

/**
 * 查询首页数据
 * GET /
 */
router.get('/', async (req, res) => {
  try {
    // 焦点图（推荐的课程）
    const recommendedCourses = await Course.findAll({
      attributes: { exclude: ['categoryId','UserId', 'context'] },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'nickname', 'avatar', 'company'],
        },
      ],
      where: { recommended: true },
      order: [['id', 'DESC']],
      limit: 10
    });

    // 人气课程
    const likesCourses = await Course.findAll({
      attributes: { exclude: ['categoryId','UserId', 'context'] },
      order: [['likesCount', 'DESC'], ['id', 'DESC']],
      limit: 10
    });

    // 入门课程
    const introductory = await Course.findAll({
      attributes: { exclude: ['categoryId','UserId', 'context'] },
      where: { introductory: true },
      order: [['id', 'DESC']],
      limit: 10
    });
    success(res, "获取首页数据成功。", {
      recommendedCourses,
      likesCourses,
      introductory
    });

  } catch (error) {
    failure(res, error);
  }
})


module.exports = router;
