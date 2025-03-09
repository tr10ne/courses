import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { debounce, dropRight } from "lodash";
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
	const { setUser } = useContext(UserContext);
	const authDropdownRef = useRef(null);
	const authDropdownMenuRef = useRef(null);

	//=======================================================
	//ФУНКЦИИ СОБЫТИЙ НАЖАТИЯ НА КНОПКИ В HEADER

	const handleLogoClick = () => {
		setIsSearchOpen(false);
		setIsMenuOpen(false);
		setIsAuthDropdownOpen(false);
	};

	const handleMenuButtonClick = () => {
		setIsSearchOpen(false);
		setIsMenuOpen((state) => !state);
		setIsAuthDropdownOpen(false);
	};

	const handleSearchIconClick = () => {
		setIsMenuOpen(false);
		setIsSearchOpen((state) => !state);
		setIsAuthDropdownOpen(false);
	};

	const handleMenuItemClick = () => {
		handleLogoClick();
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

	useEffect(() => {
		if (isAuthDropdownOpen) {
			const top =
				authDropdownRef.current.offsetHeight +
				(headerRef.current.offsetHeight -
					authDropdownRef.current.offsetHeight) /
					2;
			authDropdownMenuRef.current.style.top = top + "px";
			authDropdownMenuRef.current.style.right = 0;
			authDropdownMenuRef.current.style.opacity = 1;

			setIsSearchOpen(false);
			setIsMenuOpen(false);
		} else {
			const authDropdownRect = authDropdownRef.current.getBoundingClientRect();
			const distanceFromRightEdge = window.innerWidth - authDropdownRect.right;

			authDropdownMenuRef.current.style.right =
				(distanceFromRightEdge + authDropdownMenuRef.current.offsetWidth + 40) *
					-1 +
				"px";
		}
	}, [isAuthDropdownOpen]);

	//закрытие выпадающих элементов
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (headerRef.current.contains(event.target)) return;

			if (
				authDropdownRef.current &&
				!authDropdownRef.current.contains(event.target)
			) {
				setIsAuthDropdownOpen(false);
			}
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setIsMenuOpen(false);
			}

			if (searchRef.current && !searchRef.current.contains(event.target)) {
				setIsSearchOpen(false);
				isSearchFocusedRef.current = false;
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
	}, [setUser]);

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
				setIsAuthDropdownOpen(false);

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
				<div className="header__logo" onClick={handleLogoClick}>
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
						authDropdownMenuRef={authDropdownMenuRef}
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
