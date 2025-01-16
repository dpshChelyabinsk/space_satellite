const db = require('../database');

class ClientService {
    async registerClient({ client_fullname, client_type, client_number_of_children, client_date_registry, event_id }) {
        try {
            // Проверяем, существует ли событие
            const event = await db.Events.findByPk(event_id);
            if (!event) {
                throw new Error(`Событие с ID ${event_id} не найдено`);
            }

            // Создаем запись клиента
            const client = await db.Clients.create({
                client_fullname,
                client_type,
                client_number_of_children,
                client_date_registry,
                client_event_id: event_id
            });

            return { message: 'Клиент успешно записан на событие', client };
        } catch (error) {
            throw new Error(`Ошибка при записи клиента: ${error.message}`);
        }
    }

    async getClientsByEvent(event_id) {
        try {
            // Проверяем, существует ли событие
            const event = await db.Events.findByPk(event_id);
            if (!event) {
                throw new Error(`Событие с ID ${event_id} не найдено`);
            }

            // Получаем список клиентов для события
            const clients = await db.Clients.findAll({
                where: { client_event_id: event_id }
            });

            return clients;
        } catch (error) {
            throw new Error(`Ошибка при получении клиентов: ${error.message}`);
        }
    }
}

module.exports = new ClientService();
