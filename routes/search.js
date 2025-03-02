const express = require('express');
const router = express.Router();
const { Course} = require('../models');
const { success, failure } = require('../utils/responses');
const {Op} = require("sequelize");

router.get('/', async (req, res) => {
    try {
        const query = req.query;
        const currentPage = Math.abs(Number(query.currentPage) )|| 1;
        const pageSize = Math.abs(Number(query.pageSize) )|| 10;
        const offset = (currentPage - 1) * pageSize;

        const condition = {
            attributes: {exclude: ['CategoryId','userId','context']},
            order: [['id', 'DESC']],
            limit: pageSize,
            offset,
            where: {}
        };

        if(query.name){
            condition.where.name = {
                [Op.like]: `%${query.name}%`,
            }
        }
        const { count , rows } = await Course.findAndCountAll(condition);
        success(res, '搜索课程成功。',{
            Courses: rows,
            pagination: {
                total: count,
                currentPage,
                pageSize
            }
        });
    } catch (error) {
        failure(res, error);
    }

})

module.exports = router