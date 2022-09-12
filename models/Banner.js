'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Banner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Banner.init({
    image: {
      type: DataTypes.STRING(350),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.ENUM(['Y', 'N']),
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'Banner',
    tableName: 'ck_banner',
    timestamps: true,
    scopes: {
      withPublic: {
        attributes: ['image'],
      },
    }
  });
  Banner.associate = function (models) {

  };
  return Banner;
};

