const express = require('express');
const router = express.Router();
const {Course, Like, User} = require('../models');
const { NotFound } = require('http-errors');
const { success, failure } = require('../utils/responses');

/**
 * 点赞，取消赞
 * POST /likes
 */
router.post ('/', async (req, res) => {
    try {
        const userId = req.userId;
        const { courseId } = req.body;

        const course = await Course.findByPk(courseId);
        if (!course) {
            throw new NotFound('课程不存在。');
        }
        // 检查课程之前是否已经点赞
        const like = await Like.findOne({
            where: {
                userId,
                courseId
            }
        });
        // 如果没有点赞过，那就新增。并且课程的likesCount + 1
        if (!like) {
            await Like.create({courseId, userId});
            await course.increment('likesCount');
            success(res, '点赞成功。')
        } else {
            await Like.destroy({where: {userId, courseId}});
            await course.decrement('likesCount');
            success(res, '取消点赞成功。')
        }

    } catch (error) {
        failure(res, error);
    }
})

/**
 * 查询用户点赞的课程
 * GET /likes
 */
router.get('/', async (req, res) => {
    try {

        const query = req.query;
        const currentPage = Math.abs(Number(query.currentPage) )|| 1;
        const pageSize = Math.abs(Number(query.pageSize) )|| 10;
        const offset = (currentPage - 1) * pageSize;

        const condition = {
            attributes: {exclude: ['context']},
            order: [['id', 'DESC']],
            limit: pageSize,
            offset
        };

        // 查询当前用户
        const user = await User.findByPk(req.userId)

        // 查询当前用户点赞过的课程
        const courses = await user.getLikeCourses({
            joinTableAttributes:[],
            attributes: {exclude: ['categoryId','userId','context']},
            order: [['id', 'DESC']],
            limit: pageSize,
            offset
        })

        // 查询当前用户点赞过的课程总数
        const count = await user.countLikeCourses();

        success(res, '查询当前课程点赞的用户成功。', {
            courses,
            pagination: {
                total: count,
                currentPage,
                pageSize
            }
        });
    } catch (error) {
        failure(res, error);
    }
})

module.exports = router;