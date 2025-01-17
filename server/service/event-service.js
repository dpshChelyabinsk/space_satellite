const db = require('../database');
const ApiError = require("../exceptions/api-error");
const path = require('path');
const fs = require('fs');
const EventDto = require("../dtos/event-dto");
const fileService = require('../service/file-service');

class EventService {
    async createEvent(eventData) {
        const requiredFields = [
            'name',
            'description',
            'start',
            'place',
            'type',
            'author',
        ];

        for (const field of requiredFields) {
            if (!eventData[field]) {
                throw ApiError.BadRequest(`Поле "${field}" является обязательным`);
            }
        }

        if (
            eventData.expiry &&
            new Date(eventData.start) > new Date(eventData.expiry)
        ) {
            throw ApiError.BadRequest('Дата начала не может быть позже даты окончания');
        }

        try {
            const event = await db.Events.create({
                event_name: eventData.name,
                event_description: eventData.description,
                event_date_start: eventData.start,
                event_date_end: eventData.expiry || null,
                event_place: eventData.place,
                event_notice: eventData.notice || null,
                event_photo: eventData.photo || null,
                event_type_id: eventData.type,
                event_creator: eventData.author,
            });

            return new EventDto(event);
        } catch (error) {
            throw ApiError.BadResponse(`Ошибка базы данных: ${error.message}`);
        }
    }

    async updateEvent(eventId, updateData, req) {
        try {
            const event = await db.Events.findByPk(eventId);

            if (!event) {
                throw ApiError.NotFound(`Событие с ID ${eventId} не найдено`);
            }

            if (req.files && req.hashedDirectory) {
                const oldDirectory = path.join(__dirname, '../uploads/events', event.event_photo);

                if (fs.existsSync(oldDirectory)) {
                    fs.rmSync(oldDirectory, {recursive: true, force: true});
                }

                updateData.photo = req.hashedDirectory;
            }

            await event.update({
                event_name: updateData.name,
                event_description: updateData.description,
                event_date_start: updateData.start,
                event_date_end: updateData.expiry,
                event_place: updateData.place,
                event_notice: updateData.notice,
                event_photo: updateData.photo,
                event_type_id: updateData.type,
                event_creator: updateData.author
            });

            return new EventDto(event);
        } catch (error) {
            throw ApiError.BadResponse(`Ошибка базы данных: ${error.message}`);
        }
    }

    async getEventById(eventId, req) {
        try {
            const event = await db.Events.findByPk(eventId);

            if (!event) {
                throw ApiError.NotFound(`Событие с ID ${eventId} не найдено`);
            }

            const category = 'events';
            const fileUrls = await fileService.getFiles(`${category}/${event.event_photo}`);

            const urls = fileUrls.map(file => ({
                filename: file,
                url: `${req.protocol}://${req.get('host')}/api/download/${category}/${event.event_photo}/${file}`
            }));

            const eventDto = new EventDto(event);
            eventDto.photo = urls;

            return eventDto;
        } catch (error) {
            throw ApiError.BadResponse(`Ошибка базы данных: ${error.message}`);
        }
    }

    async getAllEvents(req) {
        try {
            const events = await db.Events.findAll();

            const eventsWithUrls = await Promise.all(
                events.map(async (event) => {
                    const category = 'events';
                    const fileUrls = await fileService.getFiles(`${category}/${event.event_photo}`);

                    const urls = fileUrls.map(file => ({
                        filename: file,
                        url: `${req.protocol}://${req.get('host')}/api/download/${category}/${event.event_photo}/${file}`
                    }));

                    const eventDto = new EventDto(event);
                    eventDto.photo = urls;

                    return eventDto;
                })
            );

            return eventsWithUrls;
        } catch (error) {
            throw ApiError.BadResponse(`Ошибка базы данных: ${error.message}`);
        }
    }

    async deleteEvent(eventId) {
        try {
            const event = await db.Events.findByPk(eventId);

            if (!event) {
                throw ApiError.NotFound(`Событие с ID ${eventId} не найдено`);
            }

            if (event.event_photo) {
                const directoryPath = path.join(__dirname, '../uploads/events', event.event_photo);
                if (fs.existsSync(directoryPath)) {
                    fs.rmSync(directoryPath, { recursive: true, force: true });
                }
            }

            await db.Clients.destroy({
                where: { client_event_id: eventId }
            });

            await event.destroy();

            return { message: `Событие с ID ${eventId} и все связанные клиенты успешно удалены` };
        } catch (error) {
            throw ApiError.BadResponse(`Ошибка при удалении события: ${error.message}`);
        }
    }
}

module.exports = new EventService();