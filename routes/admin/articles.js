const express = require('express');
const router = express.Router();
const { Article } = require('../../models');
const {Op} = require("sequelize");
const { NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');

// 公共方法：查找当前文章
const getArticle = async (req) => {
    // 获取文章id
    const {id} = req.params;
    // 查找对应文章
    const article = await Article.findByPk(id);
    if (!article) {
        throw new NotFoundError(`Article with id ${id} not found`);
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
            offset
        }
        if(query.title){
            condition.where = {
                title: {
                    [Op.like]: `%${query.title}%`
                }
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

// 删除文章
router.delete('/:id', async (req, res) => {
    try {
        const article = await getArticle(req)
        await article.destroy()
        success(res, '删除文章成功' );
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
        await article.update(body)
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

module.exports = router;