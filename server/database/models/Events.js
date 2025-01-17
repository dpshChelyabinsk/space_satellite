const Sequelize = require('sequelize');
const EventTypes = require('./EventTypes');
const Users = require('./Users')

module.exports = function (sequelize) {
    return sequelize.define('Events', {
        event_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        event_name: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        event_description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        event_date_start: {
            type: Sequelize.DATE,
            allowNull: false
        },
        event_date_end: {
            type: Sequelize.DATE
        },
        event_place: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        event_notice: {
            type: Sequelize.STRING(255)
        },
        event_photo: {
            type: Sequelize.STRING
        },
        event_type_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: EventTypes(sequelize),
                key: 'event_type_id'
            }
        },
        event_creator: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: Users(sequelize),
                key: 'user_id'
            }
        }
    }, {
        timestamps: false,
        tableName: 'events'
    });
};