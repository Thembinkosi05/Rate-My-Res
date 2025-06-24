'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    university_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Can be null initially
      references: {
        model: 'universities', // table name
        key: 'id',
      }
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    tableName: 'users', // Ensure correct table name
    timestamps: false // We handle created_at manually for now
  });

  User.associate = function(models) {
    User.belongsTo(models.University, { foreignKey: 'university_id' });
    User.hasMany(models.Review, { foreignKey: 'user_id' });
  };
  return User;
};