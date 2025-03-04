  //ШИрина страницы для запрета скрытия header
  export	const isDesktop = () => {
		return window.innerWidth > 1024;
	};
	//ШИрина страницы для бургера
    export	const isMobile=()=>{
		return window.innerWidth <= 768;
	}