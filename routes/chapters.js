const express = require('express');
const router = express.Router();
const { Category, User, Course, Chapter } = require('../models');
const { success, failure } = require('../utils/responses');
const { NotFoundError } = require('../utils/errors');

/**
 * 查询章节详情
 *GET /courses/:id
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const chapter = await Chapter.findByPk(id, {
            attributes: {exclude: ['CourseId']}
        });
        if (!chapter) {
            throw new NotFoundError(`ID: ${id} 的章节未找到。`);
        }

        // 查询章节关联的课程
        const course = await chapter.getCourse({
            attributes: ['id','name','userId']
        })
        // 查询课程关联的用户
        const user = await course.getUser({
            attributes: ['id', 'username', 'nickname', 'avatar', 'company']
        })

        // 同属一个课程的所有章节
        const chapters = await Chapter.findAll({
            attributes: {exclude: ['CourseId', 'context']},
            where: { courseId: chapter.courseId },
            order: [['rank', 'ASC'],['id', 'DESC']],
        });

        success(res, '查询课程成功', { chapter, chapters, course, user})
    } catch (error) {
        failure(res, error);
    }
})

module.exports = router;
