'use strict';
const {
  Model
} = require('sequelize');
const moment = require('moment/moment');
moment.locale('zh-cn');

module.exports = (sequelize, DataTypes) => {
  class Chapter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Chapter.belongsTo(models.Course, {as: 'course'});
    }
  }
  Chapter.init({
    courseId: {
      type:DataTypes.INTEGER,
      allowNull: false,
      async isPresent(value) {
        const course = await sequelize.models.Course.findByPk(value);
        if (course) {
          throw new Error(`ID为${course.id}的课程不存在。`);
        }
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: '标题必须填写。'},
        notEmpty: {msg: '标题不能为空。'},
        len: {args: [2, 45], msg: '标题长度必须是2~45之间。'}
      }
    },
    context: DataTypes.TEXT,
    video: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {msg: '视频地址不正确。'}
      }
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    modelName: 'Chapter',
  });
  return Chapter;
};