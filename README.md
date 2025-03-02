## 配置环境变量
将`.env.example`文件拷贝为`.env`文件，并修改配置。

```txt
NODE_ENV=development
PORT=3000
SECRET=你的密钥
```
其中`POST`为服务器端口，`SECRET`配置为密钥

## 生成密钥

在node环境中运行下面命令
```JavaScript
const crypto = require('crypto');
// 生成随机32位字符串
console.log(crypto.randomBytes(32).toString('hex'));
```
复制生成的密钥，并填写到`.env`文件中的`SECRET`配置,`NODE_ENV` 配置为开发环境，如部署在生产环境可改为`production`

## 安装与运行
```shell
# 安装项目依赖
npm i

# 创建数据库
npx sequelize-cli db:create --charset utf8mb4 --collate utf8mb4_general_ci

# 运行迁移，自动建表
npx sequelize-cli db:migrate

# 运行种子，填充初始数据
npx sequelize-cli db:seed:all

# 启动项目
npm start
```
访问地址：http://localhost:3000 , 详情可查看接口文档https://apifox.com/apidoc/shared-d11bd9fc-2ab9-4e04-bb04-163c8077044f

## 初始管理员账号信息
```text
username: admin
password: 123456
```