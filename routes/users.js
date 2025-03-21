const express = require('express');
const router = express.Router();
const { User } = require('../models');
const {Op} = require("sequelize");
const { BadRequest } = require('http-errors');
const { success, failure } = require('../utils/responses');
const bcrypt = require('bcryptjs');
const { setKey, getKey, delKey } = require('../utils/redis');


// 公共方法：查找当前用户
const getUser = async (req, showPassword = false) => {
  // 获取用户id
  const id = req.userId;
  let condition = {}
  if (!showPassword) {
    condition = {
      attributes: { exclude: ['password'] },
    };
  }
  // 查找对应用户
  const user = await User.findByPk(id, condition);
  if (!user) {
    throw new NotFound(`User with id ${id} not found`);
  }
  return user;
}

/**
 * 查询当前登录用户详情
 * GET /users/me
 */

router.get('/me', async (req, res) => {
  try {
    let user = await getKey(`user:${req.userId}`);
    if (!user) {
      user = await getUser(req)
      await setKey(`user:${req.userId}`, user);
    }
    success(res,'查询用户成功', { user } );
  } catch (error) {
    failure(res, error);
  }
})


/**
 * 修改用户信息
 *PUT /user/info
 */
router.put('/info', async (req, res) => {
  try {
    // 白名单过滤
    const body = {
      nickname: req.body.nickname,
      sex: req.body.sex,
      company: req.body.company,
      introduce: req.body.introduce,
      avatar:req.body.avatar
    };

    const user = await getUser(req)

    await user.update(body)
    await clearCache(user);
    success(res, '更新用户成功', { user } );
  } catch (error) {
    failure(res, error);
  }
})

/**
 * 更新账户信息
 * PUT /users/account
 */
router.put('/account', async (req, res) => {
  try {
    const body = {
      email: req.body.email,
      username: req.body.username,
      current_password: req.body.current_password,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };
    if (!body.current_password) {
      throw new BadRequest(`当前密码必须填写。`);
    }
    if (body.password !== req.body.passwordConfirmation) {
      throw new BadRequest(`两次输入的密码不一致。`);
    }
    // 加上true参数，可以查询到加密后的密码
    const user = await getUser(req, true);

    // 验证当前密码是否正确
    const isPasswordValid = bcrypt.compareSync(body.current_password, user.password);
    if(!isPasswordValid) {
      throw new BadRequest('当前密码不正确。')
    }
    await user.update(body);
    // 删除密码
    delete user.dataValues.password;
    await clearCache(user);

    success(res, '更新账户信息成功', { user } );
  } catch (error) {
    failure(res, error);
  }
})

/**
 * 清除缓存
 */
const clearCache = async (user) => {
  await delKey(`user:${user.id}`);
}

module.exports = router;