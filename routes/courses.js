const express = require('express');
const router = express.Router();
const { Course, Category, Chapter, User } = require('../models');
const { success, failure } = require('../utils/responses');
const { NotFound,BadRequest } = require('http-errors');

/**
 * 查询课程列表
 * GET /courses/
 */
router.get('/', async (req, res) => {
    try {
        const query = req.query;
        const currentPage = Math.abs(Number(query.currentPage) )|| 1;
        const pageSize = Math.abs(Number(query.pageSize) )|| 10;
        const offset = (currentPage - 1) * pageSize;

        if(!query.categoryId){
            throw new BadRequest('获取分类列表失败，分类ID不能为空')
        }

        const condition = {
            attributes: {exclude: ['CategoryId', 'UserId', 'context']},
            where: { categoryId: query.categoryId },
            order: [['id', 'DESC']],
            limit: pageSize,
            offset
        };
        const { count , rows } = await Course.findAndCountAll(condition);
        success(res, '查询课程列表成功。',{
            courses: rows,
            currentPage,
            pageSize
        })

    } catch (error) {
        failure(res, error);
    }
})

/**
 * 查询课程详情
 *GET /courses/:id
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const condition = {
            attributes: {exclude: ['CategoryId', 'UserId']},
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name'],
                },
                {
                    model: Chapter,
                    as: 'chapters',
                    attributes: ['id', 'title', 'rank', 'createdAt'],
                    order: [['rank','ASC'], ['id', 'DESC']],
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username', 'nickname', 'avatar', 'company'],
                }
            ]
        }
        const course = await Course.findByPk(id, condition);
        if (!course) {
            throw new NotFound(`ID: ${id} 的课程未找到。`);
        }
        success(res, '查询课程成功', { course })
    } catch (error) {
        failure(res, error);
    }
})

module.exports = router;