const express = require('express');
const router = express.Router();
const { success, failure } = require('../utils/responses');
const {config, singleFileUpload, client} = require('../utils/aliyun');
const {BadRequest} = require("../utils/errors");

/**
 * 阿里云 OSS 客户端上传
 * POST /uploads/aliyun
 */

router.post('/aliyun', (req, res) => {
    try {
        singleFileUpload(req, res, (err) => {
            if (err) {
                return failure(res,err);
            }
            if (!req.file) {
                return failure(res, new BadRequest('请选择要上传的文件。'));
            }
            success(res,'上传成功', {file: req.file});
        });
    } catch (error) {
        failure(error);
    }
})

module.exports = router