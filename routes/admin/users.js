const express = require('express');
const router = express.Router();
const { User } = require('../../models');
const {Op} = require("sequelize");
const { NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');

// 公共方法：查找当前用户
const getUser = async (req) => {
    // 获取用户id
    const {id} = req.params;
    // 查找对应用户
    const user = await User.findByPk(id);
    if (!user) {
        throw new NotFoundError(`User with id ${id} not found`);
    }
    return user;
}


// 查询用户列表

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
            order: [['id', 'DESC']],
            limit: pageSize,
            offset,
            where: {}
        }
        if(query.email){
            condition.where.email = {
                [Op.eq]: query.email
            }
        }
        if(query.username){
            condition.where.username = {
                [Op.eq]: query.username
            }
        }
        if(query.nickname){
            condition.where.nickname = {
                [Op.like]: `%${query.nickname}%`
            }
        }
        if(query.role){
            condition.where.role = {
                [Op.eq]: query.role
            }
        }
        const {count, rows} = await User.findAndCountAll(condition);
        success(res, '查询用户列表成功',
            {
                users: rows,
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
        const user = await getUser(req)
        success(res,'查询用户成功', { user } );
    } catch (error) {
        failure(res, error);
    }
})


// 添加用户
router.post('/', async (req, res) => {
    try {
        // 白名单过滤
        const body = filterBody(req);
        const user = await User.create(body);
        success(res, '创建用户成功', { user }, 201);
    } catch (error) {
        failure(res, error);
    }
})

// 更新用户
router.put('/:id', async (req, res) => {
    try {
        const user = await getUser(req)

        // 白名单过滤
        const body = filterBody(req);
        await user.update(body)
        success(res, '更新用户成功', { user } );
    } catch (error) {
        failure(res, error);
    }
})

// 白名单过滤数据
const filterBody = (req) => {
    return {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        nickname: req.body.nickname,
        sex: req.body.sex,
        company: req.body.company,
        introduce: req.body.introduce,
        role: req.body.role,
        avatar: req.body.avatar,
    };
}

module.exports = router;