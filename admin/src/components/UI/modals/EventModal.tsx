import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { Events } from "../../../models/Events";
import { Photo } from "../../../models/response/Photo";
import EventStore from "../../../store/EventStore";

interface EventModalProps {
	event: Events;
	onClose: () => void;
	eventStore: EventStore;
}

const EventModal: React.FC<EventModalProps> = observer(({ event, onClose, eventStore }) => {
	const [formData, setFormData] = useState({
		name: event.name,
		description: event.description,
		start: event.start.toISOString().substring(0, 16),
		expiry: event.expiry.toISOString().substring(0, 16),
		place: event.place,
		type: event.type.toString(),
		author: event.author,
		notice: event.notice || "",
		files: [] as File[],
	});

	const [photoList, setPhotoList] = useState<Photo[]>(event.photo);
	const [photosToDelete, setPhotosToDelete] = useState<string[]>([]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			setFormData((prev) => ({ ...prev, files: Array.from(files) }));
		}
	};

	const markPhotoForDeletion = (filename: string) => {
		setPhotosToDelete((prev) => [...prev, filename]);
		setPhotoList((prev) => prev.filter((photo) => photo.filename !== filename));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const data = new FormData();
		Object.entries(formData).forEach(([key, value]) => {
			if (key === "files") {
				(value as File[]).forEach((file) => data.append("files", file));
			} else {
				data.append(key, value as string);
			}
		});

		// Передаём фотографии на удаление
		photosToDelete.forEach((filename) => {
			data.append("photosToDelete", filename);
		});

		try {
			const headers = { "file-category": "events" };
			await eventStore.updateEvent(event.id, headers, data, photosToDelete);
			onClose();
		} catch (error) {
			console.error("Ошибка при обновлении события:", error);
		}
	};

	return (
		<div className="modal">
			<div className="modal-content">
				<button onClick={onClose} className="modal-close">Закрыть</button>
				<h2>Редактировать событие</h2>
				<form onSubmit={handleSubmit}>
					<input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Название" />
					<textarea name="description" value={formData.description} onChange={handleChange} placeholder="Описание" />
					<input type="datetime-local" name="start" value={formData.start} onChange={handleChange} />
					<input type="datetime-local" name="expiry" value={formData.expiry} onChange={handleChange} />
					<input type="text" name="place" value={formData.place} onChange={handleChange} placeholder="Место" />
					<textarea name="notice" value={formData.notice} onChange={handleChange} placeholder="Примечания" />

					{/* Управление фотографиями */}
					<div>
						<h3>Фотографии</h3>
						{photoList.map((photo) => (
							<div key={photo.filename} className="photo-item">
								<img src={photo.url} alt="Фото" style={{ maxWidth: "200px", margin: "5px" }} />
								<button onClick={() => markPhotoForDeletion(photo.filename)}>Удалить</button>
							</div>
						))}
					</div>

					{/* Добавление новых фотографий */}
					<input type="file" name="files" accept="image/*" multiple onChange={handleFileChange} />

					<button type="submit">Сохранить изменения</button>
				</form>
			</div>
		</div>
	);
});

export default EventModal;
