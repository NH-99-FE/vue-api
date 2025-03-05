const express = require('express');
const router = express.Router();
const { Category, Course} = require('../../models');
const {Op} = require("sequelize");
const { NotFound, Conflict } = require('http-errors');
const { success, failure } = require('../../utils/responses');
const { delKey} = require('../../utils/redis')

// 公共方法：查找当前分类
const getCategory= async (req) => {
    // 获取分类id
    const {id} = req.params;
    // 查找对应分类
    const categories = await Category.findByPk(id);
    if (!categories) {
        throw new NotFound(`Category with id ${id} not found`);
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
        await clearCache();
        success(res, '创建分类成功', { categories }, 201);
    } catch (error) {
        failure(res, error);
    }
})

// 删除分类
router.delete('/:id', async (req, res) => {
    try {
        const category = await getCategory(req)
        const count = await Course.count({where:{categoryId:req.params.id}});
        if( count > 0 ) {
            throw new Conflict('当前分类有课程，无法删除');
        }
        await category.destroy()
        await clearCache(category);
        success(res, '删除分类成功' );
    } catch (error) {
        failure(res, error);
    }
})

// 更新分类
router.put('/:id', async (req, res) => {
    try {
        const category = await getCategory(req)

        // 白名单过滤
        const body = filterBody(req);
        await category.update(body)
        await clearCache(category);
        success(res, '更新分类成功', { category } );
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

/**
 * 清除缓存
 */

const clearCache = async (category = null) => {
    await delKey('categories');

    if (category) {
        await delKey(`category:${category.id}`);
    }
}

module.exports = router;