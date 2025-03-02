const express = require('express');
const router = express.Router();
const { Category, Course} = require('../../models');
const {Op} = require("sequelize");
const { NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');

// 公共方法：查找当前分类
const getCategory= async (req) => {
    // 获取分类id
    const {id} = req.params;
    // 查找对应分类
    const categories = await Category.findByPk(id);
    if (!categories) {
        throw new NotFoundError(`Category with id ${id} not found`);
    }
    return categories;
}


// 查询分类列表

router.get('/', async (req,res) => {
    try {
        const query = req.query;

        const condition = {
            order: [['rank', 'ASC'],['id', 'ASC']],
            where: {}
        }
        if(query.name){
            condition.where.name = {
                    [Op.like]: `%${query.name}%`
            }
        }
        const categories = await Category.findAll(condition);
        success(res, '查询分类列表成功', {
                categories
            }
        );
    } catch (error) {
        failure(res, error);
    }
})


router.get('/:id', async (req, res) => {
    try {
        const categories = await getCategory(req)
        success(res,'查询分类成功', { categories } );
    } catch (error) {
        failure(res, error);
    }
})


// 添加分类
router.post('/', async (req, res) => {
    try {
        // 白名单过滤
        const body = filterBody(req);
        const categories = await Category.create(body);
        success(res, '创建分类成功', { categories }, 201);
    } catch (error) {
        failure(res, error);
    }
})

// 删除分类
router.delete('/:id', async (req, res) => {
    try {
        const categories = await getCategory(req)
        const count = await Course.count({where:{categoryId:req.params.id}});
        if( count > 0 ) {
            throw new Error('当前分类有课程，无法删除');
        }
        await categories.destroy()
        success(res, '删除分类成功' );
    } catch (error) {
        failure(res, error);
    }
})

// 更新分类
router.put('/:id', async (req, res) => {
    try {
        const categories = await getCategory(req)

        // 白名单过滤
        const body = filterBody(req);
        await categories.update(body)
        success(res, '更新分类成功', { categories } );
    } catch (error) {
        failure(res, error);
    }
})

// 白名单过滤数据
const filterBody = (req) => {
    return {
        name: req.body.name,
        rank: req.body.rank
    };
}

module.exports = router;