'use strict';
module.exports = (sequelize, DataTypes) => {
  const University = sequelize.define('University', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true // City can be optional
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true // Country can be optional
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  }, {
    tableName: 'universities', // Explicitly set table name to match SQL
    timestamps: false // We handle 'created_at' manually in SQL, so disable Sequelize's default timestamps
  });

  University.associate = function(models) {
    // A University can have many Residences
    University.hasMany(models.Residence, {
      foreignKey: 'university_id',
      as: 'residences' // Alias for the association
    });

    // A University can have many Users (students)
    University.hasMany(models.User, {
      foreignKey: 'university_id',
      as: 'students' // Alias for the association
    });
  };

  return University;
};
