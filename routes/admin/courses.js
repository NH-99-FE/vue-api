const express = require('express');
const router = express.Router();
const { Course,Category, User, Chapter } = require('../../models');
const {Op} = require("sequelize");
const { NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');

// 公共方法：查找当前课程
const getCourse = async (req) => {
    // 获取课程id
    const {id} = req.params;
    const condition = getCondition()
    // 查找对应课程
    const course = await Course.findByPk(id, condition);
    if (!course) {
        throw new NotFoundError(`Course with id ${id} not found`);
    }
    return course;
}


// 查询课程列表

router.get('/', async (req,res) => {
    try {
        const query = req.query;
        // 当前是第几页
        const currentPage = Math.abs(Number(query.currentPage)) || 1;
        // 每页显示数据条数
        const pageSize = Math.abs(Number(query.pageSize) )|| 10;
        // 计算offset: 从哪一页开始查找 0 1 2...
        const offset = (currentPage - 1) * pageSize;
        const condition = {
            ...getCondition(),
            order: [['id', 'DESC']],
            limit: pageSize,
            offset,
            where: {}
        }
        if(query.categoryId){
            condition.where.categoryId= {
                [Op.eq]: query.categoryId
            }
        }
        if(query.userId){
            condition.where.userId = {
                [Op.eq]: query.userId
            }
        }
        if(query.name){
            condition.where.name = {
                [Op.like]: `%${query.name}%`
            }
        }
        if(query.recommended){
            condition.where.recommended = {
                [Op.eq]: query.recommended === true
            }
        }
        if(query.introductory){
            condition.where.introductory = {
                [Op.eq]: query.introductory === true
            }
        }

        const {count, rows} = await Course.findAndCountAll(condition);
        success(res, '查询课程列表成功',
            {
                courses: rows,
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


router.get('/:id', async (req, res) => {
    try {
        const course = await getCourse(req)
        success(res,'查询课程成功', { course } );
    } catch (error) {
        failure(res, error);
    }
})


// 添加课程
router.post('/', async (req, res) => {
    try {
        // 白名单过滤
        const body = filterBody(req);
        // 获取当前登录用户的id
        body.userId = req.user.id;
        const course = await Course.create(body);
        success(res, '创建课程成功', { course }, 201);
    } catch (error) {
        failure(res, error);
    }
})

// 删除课程
router.delete('/:id', async (req, res) => {
    try {
        const course = await getCourse(req)
        const count = await Chapter.count({where:{courseId:req.params.id}});
        if (count > 0) {
            throw new Error('当前课程有章节，无法删除。')
        }
        await course.destroy()
        success(res, '删除课程成功' );
    } catch (error) {
        failure(res, error);
    }
})

// 更新课程
router.put('/:id', async (req, res) => {
    try {
        const course = await getCourse(req)

        // 白名单过滤
        const body = filterBody(req);
        await course.update(body)
        success(res, '更新课程成功', { course } );
    } catch (error) {
        failure(res, error);
    }
})

// 白名单过滤数据
const filterBody = (req) => {
    return {
        categoryId: req.body.categoryId,
        name: req.body.name,
        img: req.body.img,
        recommended: req.body.recommended,
        introductory: req.body.introductory,
        content: req.body.content,
        likesCount: req.body.likesCount,
        chaptersCount: req.body.chaptersCount,
    };
}

// 获取关联信息（查询条件）
const getCondition = () => {
    return {
        attributes: {exclude: ['CategoryId', 'UserId']},
        include: [
            {
                model: Category,
                as: 'category',
                attributes: ['id', 'name'],
            },
            {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'avatar'],
            },
        ]
    }
}

module.exports = router;