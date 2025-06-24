'use strict';
module.exports = (sequelize, DataTypes) => {
  const Residence = sequelize.define('Residence', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    university_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'universities', // Refers to the 'universities' table
        key: 'id',
      }
    },
    image_urls: {
      type: DataTypes.ARRAY(DataTypes.TEXT), // PostgreSQL array of text strings
      allowNull: true, // Can be null if no images initially
      defaultValue: [] // Default to an empty array
    },
    avg_overall_rating: {
      type: DataTypes.DECIMAL(3, 2), // NUMERIC(3, 2) for average rating (e.g., 4.25)
      defaultValue: 0.00,
      allowNull: false
    },
    total_reviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  }, {
    tableName: 'residences', // Explicitly set table name
    timestamps: false // Disable Sequelize's default timestamps
  });

  Residence.associate = function(models) {
    // A Residence belongs to one University
    Residence.belongsTo(models.University, {
      foreignKey: 'university_id',
      as: 'university' // Alias for the association
    });

    // A Residence can have many Reviews
    Residence.hasMany(models.Review, {
      foreignKey: 'residence_id',
      as: 'reviews' // Alias for the association
    });
  };

  return Residence;
};
