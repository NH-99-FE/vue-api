'use strict';
const {
  Model
} = require('sequelize');
const moment = require('moment/moment');
moment.locale('zh-cn');

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Course.belongsTo(models.Category, {as: 'category'});
      models.Course.belongsTo(models.User, {as: 'user'});
      models.Course.hasMany(models.Chapter, {as: 'chapters'});
      models.Course.belongsToMany(models.User, {through: models.Like, foreignKey: 'courseId', as: 'likeUsers'});
    }
  }
  Course.init({
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: '分类id必须填写' },
        notEmpty: { msg: '分类id不能为空' },
        async isUnique(value) {
          const category = await sequelize.models.Category.findByPk(value);
          if ( !category ) {
            throw new Error(`ID为${value}的用户不存在。`)
          }
        }
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: '用户id必须填写' },
        notEmpty: { msg: '用户id不能为空' },
        async isUnique(value) {
          const user = await sequelize.models.Category.findByPk(value);
          if ( !user ) {
            throw new Error(`ID为${value}的用户不存在。`)
          }
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: '名称必须填写'},
        notEmpty: {msg: '名称不能为空'},
        len: {
          args: [2.45],
          msg: '名称长度需要在2~45个字符之间'
        }
      }
    },
    recommended: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    introductory: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    },
    context: DataTypes.TEXT,
    likesCount: DataTypes.INTEGER,
    chaptersCount: DataTypes.INTEGER,
    img: DataTypes.STRING,
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
    modelName: 'Course',
  });
  return Course;
};