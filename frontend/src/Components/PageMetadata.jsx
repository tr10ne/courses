import { useEffect } from "react";

const PageMetadata = ({ title, description }) => {
  useEffect(() => {
    // Устанавливаем title
    document.title = title;

    // Устанавливаем meta-тег description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    }
  }, [title, description]);

  return null; // Этот компонент ничего не рендерит
};

export default PageMetadata;
