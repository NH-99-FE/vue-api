const express = require('express');
const router = express.Router();
const { Category } = require('../models');
const { success, failure } = require('../utils/responses');

/**
 *  查询分类列表
 *  GET /categories
 */
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.findAll({
            order: [['rank', 'ASC'], ['id', 'DESC']],
        });
        success(res, '查询分类成功',{ categories });
    } catch (error) {
        failure(res, error);
    }
})

module.exports = router;
