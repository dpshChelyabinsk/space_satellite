const Sequelize = require('sequelize');
const Events = require("./Events");

module.exports = function (sequelize) {
    return sequelize.define('Clients', {
        client_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        client_fullname: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        client_type: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        client_number_of_children: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        client_date_registry: {
            type: Sequelize.DATE,
            allowNull: false
        },
        client_event_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: Events(sequelize),
                key: 'event_id'
            }
        }
    }, {
        timestamps: false,
        tableName: 'clients'
    });
};