import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo";
import { debounce } from "lodash";
import axios from "axios";
import { apiUrl } from "../../js/config";
import Auth from "./Auth";
import Search from "./Search";

const Header = ({ pageRef }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
	const [isHeaderVisible, setIsHeaderVisible] = useState(true);
	const lastScrollTopRef = useRef(0);
	const menuItemsRef = useRef([]); // Ссылка для хранения элементов меню
	const authDropdownRef = useRef(null);
	const [user, setUser] = useState(null);

	const headerRef = useRef(null);

	const menuRef = useRef(null);
	const searchRef = useRef(null);

	const isSearchFocusedRef = useRef(false);
	const searchInputRef = useRef(null);

	const isDesktop = () => {
		return window.matchMedia("(min-width: 769px)").matches;
	};

	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
	};

	const handleMenuButtonClick = () => {
		setIsSearchOpen(false); // Закрываем поиск при открытии меню
		setIsMenuOpen((state) => !state); // Переключаем состояние меню
	};

	const handleSearchIconClick = () => {
		setIsMenuOpen(false); // Закрываем меню при открытии поиска
		setIsSearchOpen((state) => !state); // Переключаем состояние поиска
	};

	const handleMenuItemClick = () => {
		setIsMenuOpen(false);
	};

	// работа по авторизации
	const handleAuthIconClick = () => {
		setIsAuthDropdownOpen((state) => !state);
	};

	const handleClickOutside = (event) => {
		if (
			authDropdownRef.current &&
			!authDropdownRef.current.contains(event.target)
		) {
			setIsAuthDropdownOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		const header = headerRef.current;
		const page = pageRef.current;

		if (header && page) {
			const updateStyle = () => {
				const height = header.offsetHeight;
				page.style.marginTop = `${height}px`;

				document.documentElement.style.setProperty(
					"--element-height-px",
					`calc(100vh - ${height}px)`
				);
				document.documentElement.style.setProperty(
					"--header-height-px",
					`${height}px`
				);
				document.documentElement.style.setProperty(
					"--header-height",
					`${height}`
				);
			};

			updateStyle();

			window.addEventListener("resize", updateStyle);

			return () => {
				window.removeEventListener("resize", updateStyle);
			};
		}
	}, [pageRef]);

	// Применяем стили для меню и поиска при изменении их состояния
	useEffect(() => {
		if (menuRef.current && headerRef.current) {
			if (isMenuOpen) {
				menuRef.current.style.translate = `0 ${headerRef.current.offsetHeight}px`;
				menuRef.current.style.opacity = "1";
			} else {
				menuRef.current.style.translate = "";
				menuRef.current.style.opacity = "";
			}
		}
	}, [isMenuOpen]);

	useEffect(() => {
		if (searchRef.current && headerRef.current) {
			if (isSearchOpen) {
				if (searchInputRef.current) {
					searchInputRef.current.focus();
				}
				searchRef.current.style.translate = `0 ${headerRef.current.offsetHeight}px`;
				searchRef.current.style.opacity = "1";
			} else {
				searchRef.current.style.translate = "";
				searchRef.current.style.opacity = "";
			}
		}
	}, [isSearchOpen]);

	useEffect(() => {
		const handleScroll = () => {
			console.log(isSearchFocusedRef.current);
			if (isSearchFocusedRef.current) return;

			const currentScrollTop = window.scrollY;
			const threshold = 100;

			if (Math.abs(currentScrollTop - lastScrollTopRef.current) >= threshold) {
				if (!isDesktop() && currentScrollTop > lastScrollTopRef.current) {
					// Скролл вниз
					setIsHeaderVisible(false);
				} else {
					// Скролл вверх
					setIsHeaderVisible(true);
				}

				setIsSearchOpen(false);
				setIsMenuOpen(false);

				lastScrollTopRef.current = currentScrollTop <= 0 ? 0 : currentScrollTop; // Для мобильных браузеров
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	// Скрытие мобильного меню при изменении ширины экрана
	useEffect(() => {
		const handleResize = () => {
			if (isDesktop()) setIsMenuOpen(false);
		};

		// const debouncedResize = debounce(handleResize, 200); // debounce на 200 мс
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	useEffect(() => {
		menuItemsRef.current.forEach((item) => {
			if (item) {
				const setTitle = () => {
					item.setAttribute("title", item.textContent);
				};
				item.addEventListener("mouseenter", setTitle);
				return () => {
					item.removeEventListener("mouseenter", setTitle);
				};
			}
		});
	}, [isMenuOpen]); // Зависимость от состояния меню, чтобы обновить обработчики при открытии/закрытии

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			axios
				.get(`${apiUrl}/api/user`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then((response) => {
					setUser(response.data);
				})
				.catch((error) => {
					console.error("Ошибка при загрузке данных пользователя:", error);
				});
		}
	}, []);

	return (
		<header
			ref={headerRef}
			className={`header ${isHeaderVisible ? "" : "hidden"}`}
		>
			<div className="container header__inner">
				<div className="header__logo">
					<Link to="/">
						<Logo />
					</Link>
				</div>
				<nav ref={menuRef} className={`nav ${isMenuOpen ? "open" : ""}`}>
					<ul className="menu">
						<li className="menu__item">
							<Link
								className="menu__link"
								ref={(el) => (menuItemsRef.current[0] = el)}
								to="/courses"
								onClick={handleMenuItemClick}
							>
								Курсы
							</Link>
						</li>
						<li className="menu__item">
							<Link
								className="menu__link"
								ref={(el) => (menuItemsRef.current[1] = el)}
								to="/schools"
								onClick={handleMenuItemClick}
							>
								Школы
							</Link>
						</li>
						<li className="menu__item">
							<Link
								className="menu__link"
								ref={(el) => (menuItemsRef.current[2] = el)}
								to="/reviews"
								onClick={handleMenuItemClick}
							>
								Отзывы
							</Link>
						</li>
					</ul>
				</nav>

				<div className="header__right">
					<Search
						handleSearchIconClick={handleSearchIconClick}
						searchRef={searchRef}
						isSearchOpen={isSearchOpen}
						handleSearchChange={handleSearchChange}
						searchTerm={searchTerm}
						isSearchFocusedRef={isSearchFocusedRef}
						searchInputRef={searchInputRef}
					/>

					<Auth
						user={user}
						isAuthDropdownOpen={isAuthDropdownOpen}
						handleAuthIconClick={handleAuthIconClick}
						authDropdownRef={authDropdownRef}
					/>

					<button
						className={`btn-menu ${isMenuOpen ? "active" : ""}`}
						onClick={handleMenuButtonClick}
					>
						<span className="btn-menu__line"></span>
					</button>
				</div>
			</div>
		</header>
	);
};

export default Header;
