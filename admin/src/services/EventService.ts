import $api from "../http";
import { AxiosResponse } from "axios";
import {Events} from "../models/Events";

export default class EventService {

	static createEvent(
		eventData: FormData,
		headers: Record<string, string>
	): Promise<AxiosResponse<Events>> {
		return $api.post("/createEvent", eventData, {
			headers: {
				"Content-Type": "multipart/form-data",
				...headers,
			},
		});
	}

	static updateEvent(
		eventId: number,
		headers: Record<string, string>,
		updateData: FormData
	): Promise<AxiosResponse<Events>> {
		return $api.put(`/updateEvent/${eventId}`, updateData, {
			headers: {
				"Content-Type": "multipart/form-data",
				...headers,
			},
		});
	}

	static deletePhoto(eventId: number, filename: string): Promise<AxiosResponse> {
		return $api.delete(`/events/${eventId}/photos/${filename}`);
	}

	static fetchEventById(eventId: number): Promise<AxiosResponse<Events>> {
		return $api.get(`/getEvent/${eventId}`);
	}

	static async fetchEvents(): Promise<AxiosResponse<Events[]>> {
		const response = await $api.get("/getEvents");

		const transformedData = response.data.map((event: any) => ({
			...event,
			photo: Array.isArray(event.photo) ? event.photo : [],
		}));

		return { ...response, data: transformedData };
	}

	static deleteEvent(eventId: number): Promise<AxiosResponse<{ message: string }>> {
		return $api.delete(`/deleteEvent/${eventId}`);
	}
}
