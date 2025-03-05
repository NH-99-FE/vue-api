const express = require('express');
const router = express.Router();
const { Course,Category,User,Chapter } = require('../models');
const { success, failure } = require('../utils/responses');
const { NotFound,BadRequest } = require('http-errors');
const {setKey, getKey} = require('../utils/redis')

/**
 * 查询课程列表
 * GET /courses/
 */
router.get('/', async (req, res) => {
    try {
        const query = req.query;
        const categoryId = query.categoryId;
        const currentPage = Math.abs(Number(query.currentPage) )|| 1;
        const pageSize = Math.abs(Number(query.pageSize) )|| 10;
        const offset = (currentPage - 1) * pageSize;

        if(!categoryId){
            throw new BadRequest('获取分类列表失败，分类ID不能为空')
        }

        const cacheKey = `course:${categoryId}:${currentPage}:${pageSize}`;
        let data = await getKey(cacheKey);
        if (data) {
            return success(res, '查询课程列表成功', data)
        }

        const condition = {
            attributes: {exclude: ['CategoryId', 'UserId', 'context']},
            where: { categoryId: query.categoryId },
            order: [['id', 'DESC']],
            limit: pageSize,
            offset
        };
        const { count , rows } = await Course.findAndCountAll(condition);
        data = {
            courses: rows,
            currentPage,
            pageSize
        }
        await setKey(cacheKey, data);

        success(res, '查询课程列表成功。', data)

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
        // 查询课程
        let course = await getKey(`course:${id}`);
        if (!course) {
            course = await Course.findByPk(id, {
                attributes: {exclude: ['CategoryId', 'UserId']},
            });
            if (!course) {
                throw new NotFound(`ID: ${id} 的课程未找到。`);
            }
            await setKey(`course:${id}`, course);
        }

        // 查询课程关联的分类
        let category = await getKey(`category:${course.categoryId}`);
        if (!category) {
            category = await Category.findByPk(course.categoryId);
            await setKey(`category:${course.categoryId}`, category);
            console.log('1234')
        }

        // 查询课程关联的用户
        let user = await getKey(`user:${course.userId}`);
        if (!user) {
            user = await User.findByPk(course.userId, {
                attributes: { exclude: ['password'] },
            });
            await setKey(`user:${course.userId}`, user);
        }

        // 查询课程关联的章节
        let chapters = await getKey(`chapters:${course.id}`);
        if (!chapters) {
            chapters = await Chapter.findAll({
                attributes: {exclude: ['CourseId', 'context']},
                where: {courseId: course.id},
                order: [['rank', 'ASC'], ['id', 'DESC']],
            });
            await setKey(`chapters:${course.id}`, chapters);
        }

        success(res, '查询课程成功', { course, category, user, chapters })
    } catch (error) {
        failure(res, error);
    }
})

module.exports = router;