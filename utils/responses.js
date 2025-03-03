const { Conflict } = require('http-errors');
const {TokenExpiredError} = require("jsonwebtoken");
const createHttpError = require("http-errors");

// 请求成功

const success = (res, message, data = {}, code = 200) => {
    res.status(code).json({
        status: true,
        message,
        data
    });
}

// 请求失败
const failure = (res, error) => {

    let statusCode = 500;
    let errors = '服务器错误';

    if (error.name === 'SequelizeValidationError') {   // Sequelize验证错误
        statusCode = 400;
        errors = error.errors.map(e => e.message);
    } else if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') { // token验证错误
        statusCode = 401;
        errors = '您提交的 token 错误或已过期。'
    } else if (error instanceof createHttpError.HttpError) { //http-errors库创建的错误
        statusCode = error.status;
        errors = error.message;
    }

    res.status(statusCode).json({
        status: false,
        message: `请求失败：${error.name}`,
        errors: Array.isArray(errors) ? errors : [errors]
    });

}

module.exports = {
    success,
    failure,
}