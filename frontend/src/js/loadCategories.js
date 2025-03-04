import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

// Загружает категории с сервера и сохраняет их в sessionStorage.
export const loadCategories = async () => {
	// Проверяем, есть ли уже сохраненные категории
	const savedCategories = sessionStorage.getItem("categories");

	if (savedCategories) {
		return JSON.parse(savedCategories);
	}

	try {
		const response = await axios.get(`${apiUrl}/api/categories`);

		const result = Array.isArray(response.data)
			? response.data
			: response.data && Array.isArray(response.data.data)
			? response.data.data
			: null;

		if (Array.isArray(result)) {
			// Сохраняем категории в sessionStorage
			sessionStorage.setItem("categories", JSON.stringify(result));
			return result;
		} else {
			console.error("Ожидался массив, но получено:", response.data);
			return [];
		}
	} catch (error) {
		console.error("Ошибка при загрузке категорий:", error);
		return [];
	}
};
