const express = require('express');
const router = express.Router();
const { Category, User, Course, Chapter } = require('../models');
const { success, failure } = require('../utils/responses');
const { NotFound } = require('http-errors');
const {setKey, getKey} = require('../utils/redis')

/**
 * 查询章节详情
 *GET /courses/:id
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // 查询章节
        let chapter = await getKey(`chapter:${id}`);
        if(!chapter){
            chapter = await Chapter.findByPk(id, {
                attributes: {exclude: ['CourseId']}
            });
            if (!chapter) {
                throw new NotFound(`ID: ${id} 的章节未找到。`);
            }
            await setKey(`chapter:${id}`, chapter);
        }


        // 查询章节关联的课程

        let course = await getKey(`course:${chapter.courseId}`);
        if (!course) {
            course = await Course.findByPk(chapter.courseId, {
                attributes: {exclude: ['CategoryId','UserId']},
            });
            await setKey(`course:${chapter.courseId}`, course);
        }

        // 查询课程关联的用户
        let user = await getKey(`user:${chapter.userId}`);
        if (!user) {
            user = await User.findByPk(course.userId, {
                attributes: {exclude: ['password']},
            })
            await setKey(`user:${course.userId}`, user);
        }

        // 同属一个课程的所有章节
        let chapters = await getKey(`chapters:${course.id}`);
        if (!chapters) {
            chapters = await Chapter.findAll({
                attributes: {exclude: ['CourseId', 'context']},
                where: { courseId: chapter.courseId },
                order: [['rank', 'ASC'],['id', 'DESC']],
            })
            await setKey(`chapters:${course.id}`, chapters);
        }

        success(res, '查询课程成功', { chapter, chapters, course, user})
    } catch (error) {
        failure(res, error);
    }
})

module.exports = router;
