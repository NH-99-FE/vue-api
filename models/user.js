'use strict';
const {
  Model, where
} = require('sequelize');
const bcrypt = require('bcryptjs')
const moment = require('moment/moment');
moment.locale('zh-cn');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.Course, {as: 'courses'});
      models.User.belongsToMany(models.Course, {through: models.Like, foreignKey: 'userId', as: 'likeCourses'});

    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: '邮箱必需填写。'},
        notEmpty: {msg: '邮箱不能为空。'},
        isEmail: {msg: '邮箱格式不正确。'},
        async isUnique(value) {
          const email = await User.findOne({where: {email:value}})
          if (email) {
            throw new Error('邮箱已存在，请直接登录')
          }
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: '名称必须填写'},
        notEmpty: {msg: '名称不能为空'},
        len: {
          args: [2.45],
          msg: '名称长度需要在2~45个字符之间'
        },
        async isUnique(value) {
          const user = await User.findOne({where:{username:value}})
          if (user) {
            throw new Error('用户名已存在。')
          }
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: '密码必须填写'},
        notEmpty: {msg: '密码不能为空'},
      },
      set(value) {
        if(value.length >= 5 && value.length <= 15) {
          this.setDataValue('password', bcrypt.hashSync(value,10))
        } else {
          throw new Error('密码长度必须在5~15之间。');
        }
      }
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: '昵称必须填写'},
        notEmpty: {msg: '昵称不能为空'},
        len: {
          args: [2.45],
          msg: '名称长度需要在2~45个字符之间'
        }
      }
    },
    sex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {msg: '性别必需填写。'},
        notEmpty: {msg: '性别不能为空。'},
        isIn: {  args:[[0, 1, 2]], msg: '性别的值必须是，男性：0 女性：1 未选择：2' }
      }
    },
    company: DataTypes.STRING,
    introduce: DataTypes.TEXT,
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {msg: '用户组必需填写。'},
        notEmpty: {msg: '用户组不能为空。'},
        isIn: {  args:[[0, 100]], msg: '用户组的值必须是，普通用户：0 管理员：100' }
      }

    },
    avatar: {
      type: DataTypes.STRING,
      validate: {
        isUrl: { mag: '图片地址不正确' }
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('createdAt')).format("LL");
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('updatedAt')).format("LL");
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};