const clientService = require('../service/client-service');

class ClientController {
    async registerClient(req, res, next) {
        try {
            const { client_fullname, client_type, client_number_of_children, client_date_registry, event_id } = req.body;

            if (!client_fullname || !client_type || !client_date_registry || !event_id) {
                return res.status(400).json({ message: 'Не все обязательные поля заполнены' });
            }

            const result = await clientService.registerClient({
                client_fullname,
                client_type,
                client_number_of_children: client_number_of_children || 0,
                client_date_registry,
                event_id
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
