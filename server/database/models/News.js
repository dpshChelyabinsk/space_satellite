const Sequelize = require('sequelize');
const Users = require('./Users');

module.exports = function (sequelize) {
    return sequelize.define('News', {
        news_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        news_name: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        news_description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        news_photo: {
            type: Sequelize.STRING,
            allowNull: true
        },
        news_date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        news_creator: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: Users(sequelize),
                key: 'user_id'
            }
        }
    }, {
        timestamps: false,
        tableName: 'news'
    });
};