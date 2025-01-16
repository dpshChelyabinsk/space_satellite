const db = require('../database');
const ClientDto = require('../dtos/client-dto');

class ClientService {
    async registerClient({ fullname, type, quantity_children, date, event }) {
        try {
            const existingEvent = await db.Events.findByPk(event);
            if (!existingEvent) {
                throw new Error(`Событие с ID ${event} не найдено`);
            }

            const client = await db.Clients.create({
                client_fullname: fullname,
                client_type: type,
                client_number_of_children: quantity_children || 0,
                client_date_registry: date,
                client_event_id: event
            });

            let ClientData = new ClientDto(client);

            return { message: 'Клиент успешно записан на событие', ClientData };
        } catch (error) {
            throw new Error(`Ошибка при записи клиента: ${error.message}`);
        }
    }

    async getClientsByEvent(event_id) {
        try {
            const event = await db.Events.findByPk(event_id);
            if (!event) {
                throw new Error(`Событие с ID ${event_id} не найдено`);
            }

            const clients = await db.Clients.findAll({
                where: { client_event_id: event_id }
            });

            let ClientData = clients.map(client => new ClientDto(client));

            return ClientData;
        } catch (error) {
            throw new Error(`Ошибка при получении клиентов: ${error.message}`);
        }
    }
}

module.exports = new ClientService();
