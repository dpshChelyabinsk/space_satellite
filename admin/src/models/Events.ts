import { Photo } from "./response/Photo";

export interface Events {
	id: number;
	name: string;
	description: string;
	start: Date;
	expiry: Date;
	place: string;
	notice: string | null;
	photo: Photo[];
	type: number;
	author: string;
}