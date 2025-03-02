const express = require('express');
const router = express.Router();
const { Chapter,Course } = require('../../models');
const {Op} = require("sequelize");
const { NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');

// 公共方法：查找当前章节
const getChapter = async (req) => {
    // 获取章节id
    const {id} = req.params;
    const condition = getCondition()
    // 查找对应章节
    const chapter = await Chapter.findByPk(id, condition);
    if (!chapter) {
        throw new NotFoundError(`Chapter with id ${id} not found`);
    }
    return chapter;
}


// 查询章节列表

router.get('/', async (req,res) => {
    try {
        const query = req.query;
        // 当前是第几页
        const currentPage = Math.abs(Number(query.currentPage)) || 1;
        // 每页显示数据条数
        const pageSize = Math.abs(Number(query.pageSize) )|| 10;
        // 计算offset: 从哪一页开始查找 0 1 2...
        const offset = (currentPage - 1) * pageSize;
        if(!query.courseId){
            throw new Error(`获取章节列表失败，课程ID不能为空。`);
        }
        const condition = {
            ...getCondition(),
            order: [['rank', 'ASC'],['id', 'ASC']],
            limit: pageSize,
            offset,
            where: {}
        }
        if(query.title){
            condition.where.title = { [Op.like]: `%${query.title}%`}
        }
        if(query.courseId){
            condition.where.courseId = { [Op.eq]: query.courseId }
        }
        const {count, rows} = await Chapter.findAndCountAll(condition);
        success(res, '查询章节列表成功',
            {
                chapters: rows,
                pagination: {
                    total: count,
                    currentPage: currentPage,
                    pageSize
                }
            }
        );
    } catch (error) {
        failure(res, error);
    }
})

// 查询章节详情

router.get('/:id', async (req, res) => {
    try {
        const chapter = await getChapter(req)
        success(res,'查询章节成功', { chapter } );
    } catch (error) {
        failure(res, error);
    }
})


// 添加章节
router.post('/', async (req, res) => {
    try {
        // 白名单过滤
        const body = filterBody(req);
        const chapter = await Chapter.create(body);
        success(res, '创建章节成功', { chapter }, 201);
    } catch (error) {
        failure(res, error);
    }
})

// 删除章节
router.delete('/:id', async (req, res) => {
    try {
        const chapter = await getChapter(req)
        await chapter.destroy()
        success(res, '删除章节成功' );
    } catch (error) {
        failure(res, error);
    }
})

// 更新章节
router.put('/:id', async (req, res) => {
    try {
        const chapter = await getChapter(req)

        // 白名单过滤
        const body = filterBody(req);
        await chapter.update(body)
        success(res, '更新章节成功', { chapter } );
    } catch (error) {
        failure(res, error);
    }
})

// 白名单过滤数据
const filterBody = (req) => {
    return {
        courseId: req.body.courseId,
        title: req.body.title,
        context: req.body.context,
        video: req.body.video,
        rank: req.body.rank
    };
}

// 公共关联查询条件：关联课程数据
const getCondition = () => {
    return {
        attributes: {exclude: ['CourseId']},
        include: [
            {
                model: Course,
                as: 'course',
                attributes: ['id', 'name'],
            }
        ]
    }
}


module.exports = router;