import React, { useState, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";

const EditReviewForm = ({ review, onSave, onCancel }) => {
	const [text, setText] = useState(review.text);
	const [isTextChanged, setIsTextChanged] = useState(false); // Состояние для отслеживания изменений

	//настройка конфигурации jodit
	const config = useMemo(
		() => ({
			readonly: false, // Редактирование разрешено
			// toolbar: false, // Отключаем панель инструментов
			spellcheck: true, // Проверка орфографии
			language: "ru", // Язык интерфейса
			showCharsCounter: false, // Скрыть счетчик символов
			showWordsCounter: false, // Скрыть счетчик слов
			showXPathInStatusbar: false, // Скрыть XPath в статусбаре
			height: "auto", // Высота редактора
			// buttons: [], // Отключаем все кнопки
			// toolbarButtonSize: "medium",
			// textIcons: false,
		}),
		[]
	);

	// Отслеживаем изменения текста
	useEffect(() => {
		setIsTextChanged(text !== review.text);
	}, [text, review.text]);

	// сохранение изменений
	const handleSubmit = (e) => {
		e.preventDefault();
		if (isTextChanged) {
			const shouldSave = window.confirm("Сохранить изменения?");
			if (shouldSave) {
				onSave(text);
			}
		} else {
			onCancel();
		}
	};

	// отмена изменений
	const handleCancel = () => {
		if (isTextChanged) {
			const shouldCancel = window.confirm("Выйти без сохранения?");
			if (shouldCancel) {
				onCancel();
			}
		} else {
			onCancel();
		}
	};

	return (
		<form className="review-edit-form" onSubmit={handleSubmit}>
			<JoditEditor
				value={text}
				config={config}
				tabIndex={1}
				onBlur={(newContent) => setText(newContent)}
				onChange={(newContent) => {}}
			/>
			<div className="review-actions">
				<button type="submit">Сохранить</button>
				<button type="button" onClick={handleCancel}>
					Отмена
				</button>
			</div>
		</form>
	);
};

export default EditReviewForm;
