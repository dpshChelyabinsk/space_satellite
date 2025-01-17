const Albums = require('./Albums');
const Clients = require('./Clients');
const Events = require('./Events');
const EventTypes = require('./EventTypes');
const Media = require('./Media');
const MediaLists = require('./MediaLists');
const News = require('./News');
const Tokens = require('./Tokens');
const Users = require('./Users');

module.exports = (sequelize) => {
    return {
        Albums: Albums(sequelize),
        Clients: Clients(sequelize),
        Events: Events(sequelize),
        EventTypes: EventTypes(sequelize),
        Media: Media(sequelize),
        MediaLists: MediaLists(sequelize),
        News: News(sequelize),
        Tokens: Tokens(sequelize),
        Users: Users(sequelize),
    };
};
