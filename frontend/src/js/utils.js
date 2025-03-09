//ШИрина страницы для запрета скрытия header
export const isDesktop = () => {
	return window.innerWidth > 1024;
};
//ШИрина страницы для бургера
export const isMobile = () => {
	return window.innerWidth <= 768;
};

// Функция для проверки корректности email
export const validateEmail = (email) => {
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return regex.test(email);
};

// Функция для проверки длины пароля
export const validatePasswordLenght = (password) => {
	return password.trim().length >= 8;
};


// Функция для проверки длины имени
export const validateNameLenght = (name) => {
	return name.trim().length >= 2;
};

export const preventSpaceKeyInput = (e) => {
	// Запрещаем ввод пробела
	if (e.key === " ") {
	  e.preventDefault();
	}
  };