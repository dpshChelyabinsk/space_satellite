const eventService = require('../service/event-service');

class EventController {
    async createEvent(req, res, next) {
        try {
            const eventData = req.body;

            if (!req.hashedDirectory) {
                return res.status(400).json({message: 'Ошибка: директория не создана'});
            }

            eventData.event_photo = req.hashedDirectory;

            const newEvent = await eventService.createEvent(eventData);
            res.status(201).json({
                message: 'Событие успешно создано',
                event: newEvent,
            });
        } catch (error) {
            next(error);
        }
    }

    async getEventById(req, res, next) {
        try {
            const {eventId} = req.params;

            if (!eventId) {
                return res.status(400).json({message: 'Не указан ID события'});
            }

            const event = await eventService.getEventById(eventId, req);

            res.status(200).json(event);
        } catch (error) {
            next(error);
        }
    }

    async getAllEvents(req, res, next) {
        try {
            const events = await eventService.getAllEvents(req);

            res.status(200).json(events);
        } catch (error) {
            next(error);
        }
    }

    async updateEvent(req, res, next) {
        try {
            const {eventId} = req.params;
            const updateData = req.body;
            const newFiles = req.files; // Файлы, загруженные с помощью multer

            if (!eventId) {
                return res.status(400).json({message: 'Не указан ID события'});
            }

            const updatedEvent = await eventService.updateEvent(eventId, updateData, req);

            res.status(200).json({
                message: 'Событие успешно обновлено',
                event: updatedEvent,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteEvent(req, res, next) {
        try {
            const {eventId} = req.params;

            if (!eventId) {
                return res.status(400).json({message: 'Не указан ID события'});
            }

            const result = await eventService.deleteEvent(eventId);

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new EventController();