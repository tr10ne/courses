import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL; // Убедитесь, что у вас настроен API URL

/**
 * Загружает категории с сервера и сохраняет их в sessionStorage.
 * Если категории уже загружены, возвращает их из sessionStorage.
 * @returns {Promise<Array>} Массив категорий.
 */
export const loadCategories = async () => {
	// Проверяем, есть ли уже сохраненные категории в sessionStorage
	const savedCategories = sessionStorage.getItem('categories');

	if (savedCategories) {
		// Если категории уже сохранены, возвращаем их
		return JSON.parse(savedCategories);
	}

	try {
		// Если категорий нет, загружаем их с сервера
		const response = await axios.get(`${apiUrl}/api/categories`);

		const result = Array.isArray(response.data)
			? response.data
			: response.data && Array.isArray(response.data.data)
			? response.data.data
			: null;

		if (Array.isArray(result)) {
			// Сохраняем категории в sessionStorage
			sessionStorage.setItem('categories', JSON.stringify(result));
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