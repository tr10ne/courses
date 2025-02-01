import { useEffect } from 'react';

export const useHeaderLogic = (menuBtnRef, showSearchButtonRef) => {
    const page = document.querySelector(".page");
    const header = document.querySelector(".header");
    const menu = document.querySelector(".nav");
    const search = document.querySelector(".search");

    let lastScrollTop = 0;
    const threshold = 100;

    const handleScroll = () => {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (Math.abs(currentScrollTop - lastScrollTop) >= threshold) {
            if (currentScrollTop > lastScrollTop) {
                header.classList.add("hidden");
                closeActiveMenu();
                closeSearch();
            } else {
                header.classList.remove("hidden");
            }
            lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
        }
    };

    const closeActiveMenu = () => {
        if (menuBtnRef.current) {
            menuBtnRef.current.classList.remove("active");
        }
        menu.classList.remove("open");
        menu.style.translate = ``;
    };

    const closeSearch = () => {
        if (showSearchButtonRef.current) {
            showSearchButtonRef.current.classList.remove("active");
        }
        search.classList.remove("open");
        search.style.translate = ``;
    };

    const handleMenuButtonClick = () => {
        closeSearch();
        if (menuBtnRef.current.classList.contains("active")) {
            closeActiveMenu();
        } else {
            menu.classList.add("open");
            menuBtnRef.current.classList.add("active");
            menu.style.opacity = 1;
            menu.style.translate = `0 ${header.offsetHeight}px`;
        }
    };

    const handleSearchIconClick = () => {
        closeActiveMenu();
        if (showSearchButtonRef.current.classList.contains("active")) {
            closeSearch();
        } else {
            search.classList.add("open");
            showSearchButtonRef.current.classList.add("active");
            search.style.opacity = 1;
            search.style.translate = `0 ${header.offsetHeight}px`;
        }
    };

    const setupEventListeners = () => {
        window.addEventListener("scroll", handleScroll);
        if (menuBtnRef.current) {
            menuBtnRef.current.addEventListener("click", handleMenuButtonClick);
        }
        if (showSearchButtonRef.current) {
            showSearchButtonRef.current.addEventListener("click", handleSearchIconClick);
        }
    };

    const cleanup = () => {
        window.removeEventListener("scroll", handleScroll);
        if (menuBtnRef.current) {
            menuBtnRef.current.removeEventListener("click", handleMenuButtonClick);
        }
        if (showSearchButtonRef.current) {
            showSearchButtonRef.current.removeEventListener("click", handleSearchIconClick);
        }
    };

    return { setupEventListeners, cleanup };
};