const Sequelize = require('sequelize');
const Media = require('./Media');

module.exports = function (sequelize) {
    return sequelize.define('MediaLists', {
        media_list_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        media_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: Media(sequelize),
                key: 'media_id'
            }
        }
    }, {
        timestamps: false,
        tableName: 'media_lists'
    });
};