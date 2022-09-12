'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    username: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    role: {
      type: DataTypes.ENUM(['Member', 'Guest']),
      allowNull: true,
    },
    token: {
      type: DataTypes.STRING(75),
      allowNull: true,
    },
    loginAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    refreshAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isActive: {
      type: DataTypes.ENUM(['Y', 'N']),
      allowNull: true
    },
    mode: {
      type: DataTypes.ENUM(['user', 'azure']),
      allowNull: true
    },
    uniqueId: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'ck_user',
    timestamps: true,
    scopes: {
      withPassword: {
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      withPublic: {
        attributes: { exclude: ['loginAt', 'isActive', 'password', 'createdAt', 'updatedAt', 'mode', 'uniqueId'] },
      },
    }
  });
  User.associate = function (models) {
  
  };
  return User;
};

