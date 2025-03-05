const {BadRequest} = require('http-errors')
const { success, failure }= require('../utils/responses');
const { getKey}= require('../utils/redis');
const {NotFound} = require("../utils/errors");

module.exports=async (req, res, next)=>{
    try {
        const {captchaKey, captchaText}= req.body;
        // 判断验证码为空
        if (!captchaText) {
            throw new BadRequest('验证码不能为空。');
        }
        // 从Redis 获取验证码的值
        const captcha = await getKey(captchaKey);
        if (!captcha) {
            throw new BadRequest('验证码已过期。')
        }

        // 比对验证码， 忽略大小写
        if (captcha.toLowerCase() !== captchaText.toLowerCase()) {
            throw new BadRequest('验证码不正确。')
        }
        next();
    } catch (error) {
        failure(res, error);
    }

}