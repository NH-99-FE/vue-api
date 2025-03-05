const multer = require('multer');
const MAO = require('multer-aliyun-oss');
const OSS = require('ali-oss');
const { BadRequest } = require('http-errors');

// 阿里云配置信息
const config = {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    accessKeySecret: process.env.AWS_ACCESS_SECRET,
    bucket: process.env.AWS_BUCKET,
};

const client = new OSS(config)

// multer 配置项信息
const upload = multer({
    storage: MAO({
        config: config,
        destination: 'uploads', // 自定义上传目录
    }),
    limits: {
        fileSize: 5 * 1024 * 1024, // 限制上传文件大小为5MB
    },
    fileFilter: (req, file, cb) => {
        // 只允许上传图片
        const fileType = file.mimetype.split('/')[0];
        const isImage = fileType === 'image';

        if (!isImage) {
            return cb(new BadRequest('只允许上传图片。'));
        }
        cb(null, file);
    }
});

// 单文件上传， 指定表单字段名为file
const singleFileUpload = upload.single('file');

moudle.exports = {
    config,
    client,
    singleFileUpload
}