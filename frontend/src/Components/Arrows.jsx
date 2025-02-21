import React from "react";

const Arrows = ({state}) => {
	return (
		<svg className="sort-arrows" viewBox="0 0 16.69 22.89" >
			<path className={`sort-arrows__item ${state==='true'?'active':''}`} d="M15.91 9.03H.98c-.69 0-1.04-.85-.55-1.35L7.88.23c.31-.3.83-.3 1.13 0l7.45 7.45c.5.5.14 1.35-.55 1.35z" />
			<path className={`sort-arrows__item ${state==='false'?'active':''}`} d="M15.71 13.87H.78c-.69 0-1.04.82-.55 1.34l7.45 7.46c.31.3.83.3 1.13 0l7.45-7.46c.5-.52.14-1.34-.55-1.34z" />
		</svg>
	);
};

export default Arrows;
