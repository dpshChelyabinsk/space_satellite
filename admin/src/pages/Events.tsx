import React, {useCallback, useContext, useRef, useState} from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../App";
import { EventsClasses } from "./Styles";
import BodyBox from "../components/UI/views/BodyBox";
import EventModal from "../components/UI/modals/EventModal";
import { Events as EventsInterface } from "../models/Events";

const Events = observer(() => {
	const { eventStore } = useContext(Context);
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [showEvents, setShowEvents] = useState(false); // Состояние для отображения событий
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		start: "",
		expiry: "",
		place: "",
		type: "",
		author: "",
		notice: "",
		files: [] as File[], // Поле для загрузки файлов
	});

	// Функция загрузки событий
	const handleShowEvents = async () => {
		try {
			if (!showEvents) {
				await eventStore.fetchEvents(); // Загружаем события
			}
			setShowEvents(!showEvents);
		} catch (error) {
			console.error("Ошибка при загрузке событий:", error);
		}
	};

	// Обновление значений формы
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Обновление файлов
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			setFormData((prev) => ({
				...prev,
				files: Array.from(files), // Конвертируем FileList в массив File[]
			}));
		}
	};

	// Отправка формы
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const data = new FormData();
		Object.entries(formData).forEach(([key, value]) => {
			if (key === "files") {
				(value as File[]).forEach((file) => data.append("files", file));
			} else {
				if (value) data.append(key, value as string);
			}
		});

		try {
			const headers = { "file-category": "events" }; // Добавляем заголовок
			await eventStore.createEvent(data, headers);

			// Обновляем события и сбрасываем форму
			await eventStore.fetchEvents();
			setFormData({
				name: "",
				description: "",
				start: "",
				expiry: "",
				place: "",
				type: "",
				author: "",
				notice: "",
				files: [],
			});

			if (fileInputRef.current) {
				fileInputRef.current.value = ""; // Очищаем значение инпута файлов
			}
		} catch (error) {
			console.error("Ошибка при создании события:", error);
		}
	};

	const [selectedEvent, setSelectedEvent] = useState<EventsInterface | null>(null);


	const handleOpenModal = useCallback(async (eventId: number) => {
		try {
			await eventStore.fetchEventById(eventId);
			setSelectedEvent(eventStore.selectedEvent);
		} catch (error) {
			console.error("Ошибка при загрузке события:", error);
		}
	}, [eventStore]);

	const handleCloseModal = () => {
		setSelectedEvent(null); // Закрываем модальное окно
	};

	return (
		<BodyBox>
			<h1>Страница событий</h1>

			{/* Форма создания события */}
			<form onSubmit={handleSubmit} className={EventsClasses.form}>
				<h2>Создать событие</h2>
				<input
					type="text"
					name="name"
					placeholder="Название события"
					value={formData.name}
					onChange={handleChange}
					required
				/>
				<textarea
					name="description"
					placeholder="Описание события"
					value={formData.description}
					onChange={handleChange}
					required
				/>
				<input
					type="datetime-local"
					name="start"
					placeholder="Дата начала"
					value={formData.start}
					onChange={handleChange}
					required
				/>
				<input
					type="datetime-local"
					name="expiry"
					placeholder="Дата окончания"
					value={formData.expiry}
					onChange={handleChange}
				/>
				<input
					type="text"
					name="place"
					placeholder="Место проведения"
					value={formData.place}
					onChange={handleChange}
					required
				/>
				<input
					type="text"
					name="type"
					placeholder="Тип события"
					value={formData.type}
					onChange={handleChange}
					required
				/>
				<input
					type="text"
					name="author"
					placeholder="Автор события"
					value={formData.author}
					onChange={handleChange}
					required
				/>
				<textarea
					name="notice"
					placeholder="Примечание"
					value={formData.notice}
					onChange={handleChange}
				/>
				<input
					type="file"
					name="files"
					accept="image/*"
					multiple
					onChange={handleFileChange}
					ref={fileInputRef}
				/>
				<button type="submit">Создать</button>
			</form>

			{/* Кнопка для отображения событий */}
			<button onClick={handleShowEvents} className={EventsClasses.button}>
				{showEvents ? "Скрыть события" : "Показать события"}
			</button>

			{/* Отображение событий только при showEvents = true */}
			{showEvents && (
				<ul className={EventsClasses.eventList}>
					{eventStore.events.length === 0 ? (
						<p>Нет доступных событий</p>
					) : (
						eventStore.events.map((event) => (
							<li key={event.id} className={EventsClasses.eventItem}>
								<h2>{event.name}</h2>
								<p>{event.description}</p>
								<p>
									Дата начала: {new Date(event.start).toLocaleDateString()} — Дата окончания:{" "}
									{event.expiry ? new Date(event.expiry).toLocaleDateString() : "Не указана"}
								</p>
								<p>Место: {event.place}</p>
								<p>Примечание: {event.notice || "Отсутствует"}</p>
								<div>
									<h3>Фото:</h3>
									{Array.isArray(event.photo) && event.photo.length > 0 ? (
										event.photo.map((photo) => (
											<img
												key={photo.filename}
												src={photo.url}
												alt={`Фото события ${event.name}`}
												style={{maxWidth: "200px", margin: "5px"}}
											/>
										))
									) : (
										<p>Нет фотографий</p>
									)}
									<button onClick={() => handleOpenModal(event.id)}>Детали</button>
								</div>
							</li>
						))
					)}
				</ul>
			)}

			{selectedEvent && (
				<EventModal
					event={selectedEvent}
					onClose={handleCloseModal}
					eventStore={eventStore}
				/>
			)}
		</BodyBox>
	);
});

export default Events;
