'use strict';
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // Refers to the 'users' table
        key: 'id',
      },
      onDelete: 'CASCADE' // If a user is deleted, their reviews are also deleted
    },
    residence_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'residences', // Refers to the 'residences' table
        key: 'id',
      },
      onDelete: 'CASCADE' // If a residence is deleted, its reviews are also deleted
    },
    overall_rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1, // Ensure rating is between 1 and 5
        max: 5
      }
    },
    cleanliness_rating: {
      type: DataTypes.INTEGER,
      allowNull: true, // Can be null if not provided
      validate: {
        min: 1,
        max: 5
      }
    },
    safety_rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5
      }
    },
    facilities_rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5
      }
    },
    management_rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5
      }
    },
    social_atmosphere_rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5
      }
    },
    value_rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true // Comment can be optional
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    is_approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Reviews need admin approval by default
      allowNull: false
    }
  }, {
    tableName: 'reviews', // Explicitly set table name
    timestamps: false, // Disable Sequelize's default timestamps
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'residence_id'], // Ensure unique constraint for user_id and residence_id
        name: 'user_residence_unique_review'
      }
    ]
  });

  Review.associate = function(models) {
    // A Review belongs to one User
    Review.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user' // Alias for the association
    });

    // A Review belongs to one Residence
    Review.belongsTo(models.Residence, {
      foreignKey: 'residence_id',
      as: 'residence' // Alias for the association
    });
  };

  return Review;
};
