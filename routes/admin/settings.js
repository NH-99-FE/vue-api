const express = require('express');
const router = express.Router();
const { Setting } = require('../../models');
const {Op} = require("sequelize");
const { NotFound } = require('http-errors');
const { success, failure } = require('../../utils/responses');

// 公共方法：查找当前系统设置
const getSetting = async ( )=> {

    // 查找系统设置(第一条）
    const setting = await Setting.findOne();
    if (!setting) {
        throw new NotFound(`Setting not found`);
    }
    return setting;
}

// 获取系统设置详情

router.get('/', async (req, res) => {
    try {
        const setting = await getSetting()
        success(res,'查询系统设置成功', { setting } );
    } catch (error) {
        failure(res, error);
    }
})


// 更新系统设置
router.put('/', async (req, res) => {
    try {
        const setting = await getSetting()

        // 白名单过滤
        const body = filterBody(req);
        await setting.update(body)
        success(res, '更新系统设置成功', { setting } );
    } catch (error) {
        failure(res, error);
    }
})

// 白名单过滤数据
const filterBody = (req) => {
    return {
        name: req.body.name,
        icp: req.body.icp,
        copyright: req.body.copyright
    };
}

module.exports = router;