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
    if (error.name === 'SequelizeValidationError'){
        const errors = error.errors.map(error => error.message);
        return res.status(400).json({
            status: false,
            message: '请求参数错误',
            errors
        })
    }
    if (error.name === 'NotFoundError') {
        return res.status(404).json({
            status: false,
            message: '资源不存在',
            error: [error.message]
        });
    }
    if (error.name === 'BadRequestError') {
        return res.status(400).json({
            status: false,
            message: '请求参数错误。',
            error: [error.message]
        });
    }
    if (error.name === 'UnauthorizedError') {
        return res.status(401).json({
            status: false,
            message: '认证失败',
            error: [error.message]
        });
    }
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            status: false,
            message: '认证失败',
            error: ['您提交的 token 错误。']
        });
    }
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: false,
            message: '认证失败',
            error: ['您的 token 已过期。']
        });
    }
    res.status(500).json({
        status: false,
        message: '服务器错误',
        error: [error.message]
    });
}

module.exports = {
    success,
    failure,
}