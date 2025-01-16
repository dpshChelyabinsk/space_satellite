module.exports = class ClientDto {
    id;
    fullname;
    type;
    quantity_children;
    date;
    event;

    constructor(model) {
        this.id = model.client_id;
        this.fullname = model.client_fullname;
        this.type = model.client_type;
        this.quantity_children = model.client_number_of_children;
        this.date = model.client_date_registry;
        this.event = model.client_event_id;
    }
}