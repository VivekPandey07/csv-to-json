const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    address: {
        type: DataTypes.JSONB,
        defaultValue: null,
    },
    additionalInfo: {
        type: DataTypes.JSONB,
        defaultValue: null,
    },
}, {
    timestamps: false, 
});

module.exports = User;
