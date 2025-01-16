module.exports = class EventDto {
    id;
    name;
    description;
    start;
    expiry;
    place;
    notice;
    photo;
    type;
    author;

    constructor(model) {
        this.id = model.event_id;
        this.name = model.event_name;
        this.description = model.event_description;
        this.start = model.event_date_start;
        this.expiry = model.event_date_end;
        this.place = model.event_place;
        this.notice = model.event_notice;
        this.photo = model.event_photo;
        this.type = model.event_type_id;
        this.author = model.event_creator;
    }
}