'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Category.init({
    name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.ENUM(['Y', 'N']),
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'ck_category',
    timestamps: true,
    scopes: {
      withPublic: {
        attributes: ['id','name'],
      },
    }
  });
  Category.associate = function (models) {

  };
  return Category;
};

