const clientService = require('../service/client-service');

class ClientController {
    async registerClient(req, res, next) {
        try {
            const { fullname, type, quantity_children, date, event } = req.body;

            if (!fullname || !type || !date || !event) {
                return res.status(400).json({ message: 'Не все обязательные поля заполнены' });
            }

            const result = await clientService.registerClient({
                fullname,
                type,
                quantity_children: quantity_children || 0,
                date,
                event
            });

            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getClientsByEvent(req, res, next) {
        try {
            const { event_id } = req.params;

            if (!event_id) {
                return res.status(400).json({ message: 'Не указан ID события' });
            }

            const clients = await clientService.getClientsByEvent(event_id);

            res.status(200).json(clients);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ClientController();
