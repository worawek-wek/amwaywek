'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Media extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Media.init({
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
    modelName: 'Media',
    tableName: 'tb_Media',
    timestamps: true,
    scopes: {
      withPublic: {
        attributes: ['image'],
      },
    }
  });
  Media.associate = function (models) {

  };
  return Media;
};

