const Search = ({
	handleSearchIconClick,
	searchRef,
	isSearchOpen,
	handleSearchChange,
	searchTerm,
	isSearchFocusedRef,
	searchInputRef
}) => {

	const handleFocus = () => {
		isSearchFocusedRef.current = true;
	};

	const handleBlur = () => {
		isSearchFocusedRef.current = false;
	};


	return (
		<>

			<div ref={searchRef} className={`search ${isSearchOpen ? "open" : ""}`}>
				<form className="search__form" method="get" action={"/courses"}>
					<button type="submit" className="search__button" id="searchButton">
						<svg viewBox="0 0 20 20" className="svg-loupe">
							<path d="M8.808 0C3.95 0 0 3.951 0 8.808c0 4.856 3.951 8.807 8.808 8.807 4.856 0 8.807-3.95 8.807-8.807S13.665 0 8.808 0Zm0 15.99c-3.96 0-7.182-3.223-7.182-7.182 0-3.96 3.222-7.182 7.182-7.182 3.96 0 7.181 3.222 7.181 7.182 0 3.96-3.222 7.181-7.181 7.181Z" />
							<path d="m19.762 18.612-4.661-4.661a.812.812 0 1 0-1.15 1.15l4.661 4.66a.81.81 0 0 0 1.15 0 .813.813 0 0 0 0-1.149Z" />
						</svg>
					</button>
					<input
					ref={searchInputRef}
						type="text"
						placeholder="Искать курсы..."
						value={searchTerm}
						onChange={handleSearchChange}
						className="search__input"
						name="search"
						onFocus={handleFocus}
						onBlur={handleBlur}
					/>
				</form>
			</div>

            <button
				type="button"
				className="search__button"
				id="showSearchButton"
				onClick={handleSearchIconClick}
			>
				<svg viewBox="0 0 20 20" className="svg-loupe">
					<path d="M8.808 0C3.95 0 0 3.951 0 8.808c0 4.856 3.951 8.807 8.808 8.807 4.856 0 8.807-3.95 8.807-8.807S13.665 0 8.808 0Zm0 15.99c-3.96 0-7.182-3.223-7.182-7.182 0-3.96 3.222-7.182 7.182-7.182 3.96 0 7.181 3.222 7.181 7.182 0 3.96-3.222 7.181-7.181 7.181Z" />
					<path d="m19.762 18.612-4.661-4.661a.812.812 0 1 0-1.15 1.15l4.661 4.66a.81.81 0 0 0 1.15 0 .813.813 0 0 0 0-1.149Z" />
				</svg>
			</button>
		</>
	);
};

export default Search;
