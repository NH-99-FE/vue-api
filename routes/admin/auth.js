const express = require('express');
const router = express.Router();
const { User } = require('../../models');
const {Op} = require("sequelize");
const { BadRequest, Unauthorized, NotFound } = require('http-errors');
const { success, failure } = require('../../utils/responses');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const crypto = require('crypto');

/**
 * 管理员登录
 * POST /admin/auth/sign_in
 */
router.post('/sign_in', async(req, res) => {
    try {
        // 生成随机32位字符串
        // console.log(crypto.randomBytes(32).toString('hex'));

        const { login ,password } = req.body;
        if (!login) {
            throw new Error('邮箱/用户名必须填写。');
        }
        if (!password) {
            throw new Error('密码必须填写。');
        }
        const condition = {
            where: {
                [Op.or]: [
                    {email: login},
                    {username: login}
                ]
            }
        };
        // 通过email或username，查询用户是否存在
        const user = await User.findOne(condition);
        if (!user) {
            throw new NotFound('用户不存在，无法登录。');
        }
        // 验证密码
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            throw new Unauthorized('密码错误');
        }
        // 验证是否是管理员
        if (user.role !== 100){
            throw new Unauthorized('您没有权限登录管理员平台');
        }
        // 生成身份验证令牌
        const token = jwt.sign({
            userId: user.id,
        }, process.env.SECRET,{expiresIn: '7d'});

        success(res, '登陆成功', { token })
    } catch (error) {
        failure(res, error);
    }
});

module.exports = router;