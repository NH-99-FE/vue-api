const express = require('express');
const router = express.Router();
const { Setting } = require('../models');
const { success, failure } = require('../utils/responses');
const { NotFound } = require('http-errors');

/**
 * 查询系统设置
 * GET /settings
 */
router.get('/', async (req, res) => {
    try {
        const setting = await Setting.findOne();
        if (!setting) {
            throw new NotFound('未找到系统设置，请联系管理员。');
        }
        success(res, '查询系统信息成功。', { setting });
    } catch (error) {
        failure(res, error);
    }
})


module.exports = router;