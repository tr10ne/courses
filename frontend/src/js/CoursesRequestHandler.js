export class CoursesRequestHandler {
	constructor(
		location,
		pagination,
		sliderValues,
		selectedSchoolsId,
		ratingSort,
		priceSort,
		params,
		recordsPerPage
	) {
        this.recordsPerPage = recordsPerPage;

		this.location = location;
		this.pagination = pagination;
		this.sliderValues = sliderValues;
		this.selectedSchoolsId = selectedSchoolsId;
		this.ratingSort = ratingSort;
		this.priceSort = priceSort;
		this.params = params;
	}

	//получаем данные из запроса ?search=
    getSearchFilter() {
		const searchParams = new URLSearchParams(this.location.search);
		return searchParams.get("search") || "";
	}

	//получаем параметры для запроса
	prepareRequestParams() {
		const newFilter = this.getSearchFilter();

		return {
			limit: this.recordsPerPage,
			page: this.pagination.current_page,
			filter: newFilter,
			minPrice: this.sliderValues[0],
			maxPrice: this.sliderValues[1],
			selectedSchoolsId: this.selectedSchoolsId.join(","),
			sort_rating: this.ratingSort,
			sort_price: this.priceSort,
		};
	}
	//часть строки запроса с выбранной категорией и подкатегорией
	prepareRequestUrl() {
		let request = this.params.categoryUrl ?? "";

		if (request && this.params.subcategoryUrl) {
			request += `/${this.params.subcategoryUrl}`;
		}

		return request;
	}

}
