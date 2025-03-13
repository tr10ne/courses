// import React, { useState } from "react";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// const EditReviewForm = ({ review, onSave, onCancel }) => {
//   const [text, setText] = useState(review.text);
//   console.log(review.text);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave(text); // Передаем обновленный текст отзыва
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <CKEditor
//         editor={ClassicEditor}
//         data={text}
//                onChange={(event, editor) => {
//           const data = editor.getData();
//           setText(data);
//         }}

//       />
//       <div>
//         <button type="submit">Сохранить</button>
//         <button type="button" onClick={onCancel}>
//           Отмена
//         </button>
//       </div>
//     </form>
//   );

// };

// export default EditReviewForm;

import React, { useState, useMemo } from "react";
import JoditEditor from "jodit-react";

const EditReviewForm = ({ review, onSave, onCancel }) => {
  const [text, setText] = useState(review.text);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(text); // Передаем обновленный текст отзыва
  };

  const config = useMemo(
    () => ({
      readonly: false, // Все параметры конфигурации Jodit
      toolbar: true,
      spellcheck: true,
      language: "ru",
      toolbarButtonSize: "medium",
      textIcons: false,
      // Другие настройки...
    }),
    []
  );

  return (
    <form onSubmit={handleSubmit}>
      <JoditEditor
        value={text}
        config={config}
        tabIndex={1} // tabIndex of textarea
        onBlur={(newContent) => setText(newContent)} // preferred to use only this option to update the content for performance reasons
        onChange={(newContent) => {}}
      />
      <div>
        <button type="submit">Сохранить</button>
        <button type="button" onClick={onCancel}>
          Отмена
        </button>
      </div>
    </form>
  );
};

export default EditReviewForm;