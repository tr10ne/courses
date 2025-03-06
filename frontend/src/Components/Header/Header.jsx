import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import { apiUrl } from "../../js/config";
import Logo from "../Logo";
import Auth from "./Auth";
import Search from "./Search";
import { isDesktop, isMobile } from "../../js/utils";
import { UserContext } from "../UserContext";

const Header = ({ pageRef }) => {
	const headerRef = useRef(null);
	const menuRef = useRef(null);
	const searchRef = useRef(null);
	const menuItemsRef = useRef([]); // Ссылка для хранения элементов меню(для атрибута title)

	//открытие элементов меню при нажатии
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const searchInputRef = useRef(null); //ссылка на input поиска
	const isSearchFocusedRef = useRef(false);
	const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);

	// скрываем header
	const [isHeaderVisible, setIsHeaderVisible] = useState(true);
	const lastScrollTopRef = useRef(0); //последнее положение скролла

	//авторизация
	const { user, setUser } = useContext(UserContext);
	const authDropdownRef = useRef(null);

	//=======================================================
	//ФУНКЦИИ СОБЫТИЙ НАЖАТИЯ НА КНОПКИ В HEADER

	const handleMenuButtonClick = () => {
		setIsSearchOpen(false);
		setIsMenuOpen((state) => !state);
	};

	const handleSearchIconClick = () => {
		setIsMenuOpen(false);
		setIsSearchOpen((state) => !state);
	};

	const handleMenuItemClick = () => {
		setIsMenuOpen(false);
	};

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

	//=======================================================
	// АВТОРИЗАЦИЯ

	const handleAuthIconClick = () => {
		setIsAuthDropdownOpen((state) => !state);
	};

	//закрытие меню авторизации
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				authDropdownRef.current &&
				!authDropdownRef.current.contains(event.target)
			) {
				setIsAuthDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	//обработка входа пользователя
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

	//=======================================================
	//АДАПТИВНЫЙ HEADER

	//отслеживание высоты header c измененеием margin-top у page
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

	//скрытие header и его подменю при скроллинге
	useEffect(() => {
		const handleScroll = () => {
			if (isSearchFocusedRef.current) return;

			const currentScrollTop = window.scrollY;
			const threshold = 100;

			if (Math.abs(currentScrollTop - lastScrollTopRef.current) >= threshold) {
				if (!isDesktop() && currentScrollTop > lastScrollTopRef.current) {
					setIsHeaderVisible(false);
				} else {
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

	// Скрытие меню при изменении ширины экрана
	useEffect(() => {
		const handleResize = () => {
			if (!isMobile()) setIsMenuOpen(false);
		};

		const debouncedResize = debounce(handleResize, 200);
		window.addEventListener("resize", debouncedResize);

		return () => {
			window.removeEventListener("resize", debouncedResize);
		};
	}, []);

	//заголовки при наведении на меню
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
	}, []);

	//=======================================================
	//ОТРИСОВКА ЭЛЕМЕНТОВ

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
						isSearchFocusedRef={isSearchFocusedRef}
						searchInputRef={searchInputRef}
					/>

					<Auth
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
