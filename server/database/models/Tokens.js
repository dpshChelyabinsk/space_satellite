const Sequelize = require('sequelize');
const Users = require('./Users');

module.exports = function (sequelize) {
    return sequelize.define('Tokens', {
        token_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        token: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        token_user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: Users(sequelize),
                key: 'user_id'
            }
        }
    }, {
        timestamps: false,
        tableName: 'tokens'
    });
};