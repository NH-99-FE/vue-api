const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();

const adminAuth = require('./middlewares/admin-auth');
const userAuth = require('./middlewares/user-auth');
const cors = require('cors');

// 前台路由文件
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const categoryRouter = require('./routes/categories');
const courseRouter = require('./routes/courses');
const chapterRouter = require('./routes/chapters');
const articleRouter = require('./routes/articles');
const settingRouter = require('./routes/settings');
const searchRouter = require('./routes/search');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');
const likeRouter = require('./routes/likes');

// 后台路由文件
const adminArticlesRouter = require('./routes/admin/articles');
const adminCategoriesRouter = require('./routes/admin/categories');
const adminSettingsRouter = require('./routes/admin/settings');
const adminUsersRouter = require('./routes/admin/users');
const adminCoursesRouter = require('./routes/admin/courses');
const adminChaptersRouter = require('./routes/admin/chapters');
const adminChartsRouter = require('./routes/admin/charts');
const adminAuthRouter = require('./routes/admin/auth');


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// CORS跨域配置
// const corsOptions = {
//     origin:[
//         'url1',
//         'url2'
//     ]
// }
// app.use(cors(corsOptions));
app.use(cors());

// 前台路由配置
app.use('/', indexRouter);
app.use('/category', categoryRouter);
app.use('/courses', courseRouter);
app.use('/chapters', chapterRouter);
app.use('/articles', articleRouter);
app.use('/settings', settingRouter);
app.use('/search', searchRouter);
app.use('/auth', authRouter);
app.use('/users', userAuth, userRouter);
app.use('/likes', userAuth, likeRouter);

// 后台路由配置
// 先注册不需要认证的路由
app.use('/admin/auth', adminAuthRouter); // 登录相关的路由不需要认证

// 其他需要认证的路由
app.use('/', adminAuth, indexRouter);
app.use('/users', adminAuth, usersRouter);
app.use('/admin/articles', adminAuth, adminArticlesRouter);
app.use('/admin/categories', adminAuth, adminCategoriesRouter);
app.use('/admin/settings', adminAuth,  adminSettingsRouter);
app.use('/admin/users', adminAuth, adminUsersRouter);
app.use('/admin/courses', adminAuth, adminCoursesRouter);
app.use('/admin/chapters', adminAuth, adminChaptersRouter);
app.use('/admin/charts', adminAuth, adminChartsRouter)


module.exports = app;
