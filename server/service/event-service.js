const db = require('../database');
const ApiError = require("../exceptions/api-error");
const path = require('path');
const fs = require('fs');
const EventDto = require("../dtos/event-dto");
const fileService = require('../service/file-service');

class EventService {
    async createEvent(eventData) {
        const requiredFields = [
            'event_name',
            'event_description',
            'event_date_start',
            'event_place',
            'event_type_id',
            'event_creator',
        ];

        for (const field of requiredFields) {
            if (!eventData[field]) {
                throw ApiError.BadRequest(`Поле "${field}" является обязательным`);
            }
        }

        if (
            eventData.event_date_end &&
            new Date(eventData.event_date_start) > new Date(eventData.event_date_end)
        ) {
            throw ApiError.BadRequest('Дата начала не может быть позже даты окончания');
        }

        try {
            const event = await db.Events.create({
                event_name: eventData.event_name,
                event_description: eventData.event_description,
                event_date_start: eventData.event_date_start,
                event_date_end: eventData.event_date_end || null,
                event_place: eventData.event_place,
                event_notice: eventData.event_notice || null,
                event_photo: eventData.event_photo || null,
                event_type_id: eventData.event_type_id,
                event_creator: eventData.event_creator,
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

                updateData.event_photo = req.hashedDirectory;
            }

            await event.update(updateData);

            return new EventDto(event);
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

            await event.destroy();

            return { message: `Событие с ID ${eventId} успешно удалено` };
        } catch (error) {
            throw ApiError.BadResponse(`Ошибка при удалении события: ${error.message}`);
        }
    }
}

module.exports = new EventService();