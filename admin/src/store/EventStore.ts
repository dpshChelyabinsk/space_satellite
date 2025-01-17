import {action, makeAutoObservable} from "mobx";
import EventService from "../services/EventService";
import { Events } from "../models/Events";

export default class EventStore {
	events: Events[] = [];
	selectedEvent: Events | null = null;
	isLoading = false;
	error: string | null = null;

	constructor() {
		makeAutoObservable(this, {
			setLoading: action,
			setError: action,
			setEvents: action,
			setSelectedEvent: action,
			createEvent: action,
			updateEvent: action,
			deleteEvent: action,
			fetchEvents: action,
		});
	}

	setLoading(bool: boolean) {
		this.isLoading = bool;
	}

	setError(message: string | null) {
		this.error = message;
	}

	setEvents(events: Events[]) {
		this.events = events;
	}

	setSelectedEvent(event: Events | null) {
		this.selectedEvent = event;
	}

	async createEvent(eventData: FormData, headers: Record<string, string>) {
		this.setLoading(true);
		this.setError(null);
		try {
			const response = await EventService.createEvent(eventData, headers);
			this.events.push(response.data);
		} catch (e: any) {
			this.setError(e.response?.data?.message || "Ошибка при создании события");
		} finally {
			this.setLoading(false);
		}
	}

	async updateEvent(eventId: number, headers: Record<string, string>, updateData: FormData, photosToDelete: string[]) {
		this.setLoading(true);
		this.setError(null);
		try {
			// Включаем фотографии на удаление в запрос
			photosToDelete.forEach((filename) => {
				updateData.append("photosToDelete", filename);
			});

			const response = await EventService.updateEvent(eventId, headers, updateData);

			// Обновляем события в памяти
			this.events = this.events.map(event =>
				event.id === eventId ? response.data : event
			);
		} catch (e: any) {
			this.setError(e.response?.data?.message || "Ошибка при обновлении события");
		} finally {
			this.setLoading(false);
		}
	}

	async deletePhoto(eventId: number, filename: string) {
		try {
			await EventService.deletePhoto(eventId, filename); // Реализуйте метод в EventService
		} catch (error) {
			console.error("Ошибка при удалении фото:", error);
		}
	}

	async fetchEventById(eventId: number) {
		this.setLoading(true);
		this.setError(null);
		try {
			const response = await EventService.fetchEventById(eventId);

			// Преобразуем данные в формат Events
			const event: Events = {
				...response.data,
				start: new Date(response.data.start), // Преобразуем строку в объект Date
				expiry: new Date(response.data.expiry), // Преобразуем строку в объект Date
			};

			this.setSelectedEvent(event);
		} catch (e: any) {
			this.setError(e.response?.data?.message || "Ошибка при загрузке события");
		} finally {
			this.setLoading(false);
		}
	}

	async fetchEvents() {
		this.setLoading(true);
		this.setError(null);
		try {
			const response = await EventService.fetchEvents();
			this.setEvents(response.data);
		} catch (e: any) {
			this.setError(e.response?.data?.message || "Ошибка при загрузке событий");
		} finally {
			this.setLoading(false);
		}
	}

	async deleteEvent(eventId: number) {
		this.setLoading(true);
		this.setError(null);
		try {
			await EventService.deleteEvent(eventId);
			this.events = this.events.filter(event => event.id !== eventId);
		} catch (e: any) {
			this.setError(e.response?.data?.message || "Ошибка при удалении события");
		} finally {
			this.setLoading(false);
		}
	}
}
