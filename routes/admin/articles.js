const express = require('express');
const router = express.Router();
const { Article } = require('../../models');
const {Op} = require("sequelize");
const { NotFound } = require('http-errors');
const { success, failure } = require('../../utils/responses');
const { getKeysByPattern, delKey} = require('../../utils/redis');

// 公共方法：查找当前文章
const getArticle = async (req) => {
    // 获取文章id
    const {id} = req.params;
    // 查找对应文章
    const article = await Article.findByPk(id);
    if (!article) {
        throw new NotFound(`Article with id ${id} not found`);
    }
    return article;
}


// 查询文章列表

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
        // 查询被软删除的数据
        if (query.deleted === 'true') {
            condition.paranoid = false;
            condition.where.deletedAt = {
                [Op.not]: null
            }
        }

        if(query.title){
            condition.where.title = {
                    [Op.like]: `%${query.title}%`
            }
        }
        const {count, rows} = await Article.findAndCountAll(condition);
        success(res, '查询文章列表成功',
            {
                articles: rows,
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

/**
 * 查询文章详情
 * GET /admin/articles/:id
 */
router.get('/:id', async (req, res) => {
    try {
        const article = await getArticle(req)
        success(res,'查询文章成功', { article } );
    } catch (error) {
        failure(res, error);
    }
})


// 添加文章
router.post('/', async (req, res) => {
    try {
        // 白名单过滤
        const body = filterBody(req);
        const article = await Article.create(body);
        success(res, '创建文章成功', { article }, 201);
    } catch (error) {
        failure(res, error);
    }
})
/**
 * 删除到回收站
 * POST /admin/articles/delete
 */
router.post('/delete', async (req, res) => {
    try {
        const { id } = req.body;
        await Article.destroy({where:{id}});
        await clearCache(id);

        success(res, '已删除到回收站')
    } catch (error) {
        failure(res, error);
    }
})

/**
 * 从回收站恢复
 * POST /admin/articles/restore
 */
router.post('/restore', async (req, res) => {
    try {
        const { id } = req.body;
        await Article.restore({where:{id}});
        await clearCache(id);
        success(res, '已恢复成功')
    } catch (error) {
        failure(res, error);
    }
})

/**
 * 彻底删除
 * POST /admin/articles/force_delete
 */
router.post('/force_delete', async (req, res) => {
    try {
        const { id } = req.body;
        await Article.destroy({
            where:{ id },
            force: true
        });
        success(res, '已彻底删除。')
    } catch (error) {
        failure(res, error);
    }
})


// 更新文章
router.put('/:id', async (req, res) => {
    try {
        const article = await getArticle(req)

        // 白名单过滤
        const body = filterBody(req);
        await article.update(body);
        await clearCache(article.id);
        success(res, '更新文章成功', { article } );
    } catch (error) {
        failure(res, error);
    }
})

// 白名单过滤数据
const filterBody = (req) => {
    return {
        title: req.body.title,
        content: req.body.content
    };
}

/**
 * 清除缓存
 */
const clearCache = async (id = null) => {
    // 清除所有文章缓存
    const keys = await getKeysByPattern('articles:*');
    if ( keys.length !== 0 ) {
        await delKey(keys);
    }
    // 如果传递了id, 则通过id清除文章详情缓存
    if (id) {
        // 如果id是数组，则遍历
        const keys = Array.isArray(id) ? id.map(item => `article:${item}`) : `article:${id}`;
        await delKey(keys);
    }
}

module.exports = router;