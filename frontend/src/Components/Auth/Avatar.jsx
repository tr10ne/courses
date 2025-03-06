import React from "react";

const Avatar = ({ src, alt }) => {
	return (
		<img
			className="avatar-profile"
			id="avatarPreview"
			src={src || "/images/default-avatar.jpg"}
			alt={alt || "Avatar"}
		/>
	);
};

export default Avatar;
