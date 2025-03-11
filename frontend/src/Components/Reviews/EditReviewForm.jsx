// import React, { useState } from "react";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// const EditReviewForm = ({ review, onSave, onCancel }) => {
//   const [text, setText] = useState(review.text);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave(text); // Передаем обновленный текст отзыва
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <CKEditor
//         editor={ClassicEditor}
//         data={text}
//         onChange={(event, editor) => {
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

// import React, { useState } from "react";

// const EditReviewForm = ({ review, onSave, onCancel }) => {
//   const [text, setText] = useState(review.text);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave(text); // Передаем обновленный текст отзыва
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <textarea
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         rows={10}
//         style={{ width: "100%" }}
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

// import React, { useState, useRef } from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// const EditReviewForm = ({ review, onSave, onCancel }) => {
//   const [text, setText] = useState(review.text);
//   const quillRef = useRef(null); // Создаем ref для Quill

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave(text); // Передаем обновленный текст отзыва
//   };

//   // Настройки модулей Quill
//   const modules = {
//     toolbar: [
//       [{ header: [1, 2, 3, false] }],
//       ["bold", "italic", "underline", "strike"],
//       [{ list: "ordered" }, { list: "bullet" }],
//       ["link", "image"],
//       ["clean"],
//     ],
//   };

//   // Настройки форматов Quill
//   const formats = [
//     "header",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "list",
//     "bullet",
//     "link",
//     "image",
//   ];

//   return (
//     <form onSubmit={handleSubmit}>
//       <ReactQuill
//         theme="snow" // Тема редактора
//         value={text}
//         ref={quillRef} // Передаем ref
//         onChange={setText}
//         modules={modules}
//         formats={formats}
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

// import React, { useState } from "react";
// import { Editor } from "@tinymce/tinymce-react";

// const EditReviewForm = ({ review, onSave, onCancel }) => {
//   const [text, setText] = useState(review.text);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave(text); // Передаем обновленный текст отзыва
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <Editor
//         apiKey="ВАШ_API_KEY" // Получите API-ключ на сайте TinyMCE
//         value={text}
//         onEditorChange={(newText) => setText(newText)}
//         init={{
//           height: 300,
//           menubar: false,
//           plugins: [
//             "advlist autolink lists link image charmap print preview anchor",
//             "searchreplace visualblocks code fullscreen",
//             "insertdatetime media table paste code help wordcount",
//           ],
//           toolbar:
//             "undo redo | formatselect | bold italic backcolor | \
//             alignleft aligncenter alignright alignjustify | \
//             bullist numlist outdent indent | removeformat | help",
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

// import React, { useEffect, useRef } from "react";
// import EditorJS from "@editorjs/editorjs";
// import Header from "@editorjs/header";
// import List from "@editorjs/list";
// import Image from "@editorjs/image";
// import Link from "@editorjs/link";
// import Paragraph from "@editorjs/paragraph";
// import Quote from "@editorjs/quote";
// import Embed from "@editorjs/embed";
// import Delimiter from "@editorjs/delimiter";
// import Table from "@editorjs/table";

// const EditReviewForm = ({ review, onSave, onCancel }) => {
//   const editorInstance = useRef(null); // Ref для хранения экземпляра Editor.js
//   const editorContainer = useRef(null); // Ref для контейнера Editor.js

//   // Инициализация Editor.js
//   useEffect(() => {
//     if (!editorInstance.current) {
//       editorInstance.current = new EditorJS({
//         holder: editorContainer.current, // Контейнер для редактора
//         tools: {
//           header: Header,
//           list: List,
//           image: Image,
//           link: Link,
//           paragraph: Paragraph,
//           quote: Quote,
//           embed: Embed,
//           delimiter: Delimiter,
//           table: Table,
//         },
//         data: review.content || { blocks: [] }, // Начальные данные
//       });
//     }

//     // Очистка при размонтировании компонента
//     return () => {
//       if (editorInstance.current) {
//         editorInstance.current.destroy();
//         editorInstance.current = null;
//       }
//     };
//   }, [review.content]);

//   // Сохранение данных
//   const handleSave = async () => {
//     if (editorInstance.current) {
//       const savedData = await editorInstance.current.save();
//       onSave(savedData); // Передаем сохраненные данные
//     }
//   };

//   return (
//     <div>
//       <div ref={editorContainer} /> {/* Контейнер для Editor.js */}
//       <div>
//         <button onClick={handleSave}>Сохранить</button>
//         <button onClick={onCancel}>Отмена</button>
//       </div>
//     </div>
//   );
// };

// export default EditReviewForm;

// import React, { useState, useEffect } from "react";
// import { Editor, EditorState, convertToRaw, convertFromRaw } from "draft-js";
// import "draft-js/dist/Draft.css";

// const EditReviewForm = ({ review, onSave, onCancel }) => {
//   const [editorState, setEditorState] = useState(() => {
//     // Инициализация редактора с существующим контентом
//     if (review.content) {
//       return EditorState.createWithContent(convertFromRaw(JSON.parse(review.content)));
//     }
//     return EditorState.createEmpty(); // Пустой редактор, если контента нет
//   });

//   // Сохранение данных
//   const handleSave = () => {
//     const content = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
//     onSave(content); // Передаем сохраненные данные
//   };

//   return (
//     <div>
//       <div style={{ border: "1px solid #ddd", padding: "10px", minHeight: "200px" }}>
//         <Editor
//           editorState={editorState}
//           onChange={setEditorState}
//         />
//       </div>
//       <div>
//         <button onClick={handleSave}>Сохранить</button>
//         <button onClick={onCancel}>Отмена</button>
//       </div>
//     </div>
//   );
// };

// export default EditReviewForm;

// import React, { useState, useEffect, useRef } from "react";
// import EasyMDE from "easymde";
// import "easymde/dist/easymde.min.css";

// const EditReviewForm = ({ review, onSave, onCancel }) => {
//   const [editorValue, setEditorValue] = useState(review.content || ""); // Состояние для хранения текста
//   const editorRef = useRef(null); // Ref для хранения экземпляра редактора
//   const textAreaRef = useRef(null); // Ref для textarea

//   // Инициализация EasyMDE
//   useEffect(() => {
//     const easyMDE = new EasyMDE({
//       element: textAreaRef.current,
//       initialValue: editorValue, // Устанавливаем начальное значение
//       autoDownloadFontAwesome: false, // Отключаем автоматическую загрузку FontAwesome
//       spellChecker: false, // Отключаем проверку орфографии
//       toolbar: [
//         "bold",
//         "italic",
//         "heading",
//         "|",
//         "quote",
//         "unordered-list",
//         "ordered-list",
//         "|",
//         "link",
//         "image",
//         "|",
//         "preview",
//         "side-by-side",
//         "fullscreen",
//         "|",
//         "guide",
//       ], // Настройка тулбара
//     });

//     // Сохраняем экземпляр редактора
//     editorRef.current = easyMDE;

//     // Обработчик изменения текста
//     easyMDE.codemirror.on("change", () => {
//       setEditorValue(easyMDE.value());
//     });

//     // Очистка при размонтировании
//     return () => {
//       easyMDE.toTextArea(); // Уничтожаем экземпляр редактора
//       editorRef.current = null;
//     };
//   }, []);

//   // Сохранение данных
//   const handleSave = () => {
//     onSave(editorValue); // Передаем сохраненные данные
//   };

//   return (
//     <div>
//       <textarea ref={textAreaRef} /> {/* Textarea для EasyMDE */}
//       <div>
//         <button onClick={handleSave}>Сохранить</button>
//         <button onClick={onCancel}>Отмена</button>
//       </div>
//     </div>
//   );
// };

// export default EditReviewForm;

// import React, { useState, useEffect, useRef } from "react";
// import EasyMDE from "easymde";
// import "easymde/dist/easymde.min.css";

// const EditReviewForm = ({ review, onSave, onCancel }) => {
//   const [editorValue, setEditorValue] = useState(review.content || ""); // Состояние для хранения текста
//   const editorRef = useRef(null); // Ref для хранения экземпляра редактора
//   const textAreaRef = useRef(null); // Ref для textarea

//   // Инициализация EasyMDE
//   useEffect(() => {
//     const easyMDE = new EasyMDE({
//       element: textAreaRef.current,
//       initialValue: editorValue, // Устанавливаем начальное значение
//       autoDownloadFontAwesome: false, // Отключаем автоматическую загрузку FontAwesome
//       spellChecker: false, // Отключаем проверку орфографии
//       toolbar: [
//         "bold",
//         "italic",
//         "heading",
//         "|",
//         "quote",
//         "unordered-list",
//         "ordered-list",
//         "|",
//         "link",
//         "image",
//         "|",
//         "preview",
//         "side-by-side",
//         "fullscreen",
//         "|",
//         "guide",
//       ], // Настройка тулбара
//     });

//     // Сохраняем экземпляр редактора
//     editorRef.current = easyMDE;

//     // Обработчик изменения текста
//     easyMDE.codemirror.on("change", () => {
//       setEditorValue(easyMDE.value());
//     });

//     // Очистка при размонтировании
//     return () => {
//       easyMDE.toTextArea(); // Уничтожаем экземпляр редактора
//       editorRef.current = null;
//     };
//   }, []); // Пустой массив зависимостей, чтобы редактор инициализировался только один раз

//   // Обновление значения редактора, если `review.content` изменился
//   useEffect(() => {
//     if (editorRef.current && review.content) {
//       editorRef.current.value(review.content);
//     }
//   }, [review.content]);

//   // Сохранение данных
//   const handleSave = () => {
//     onSave(editorValue); // Передаем сохраненные данные
//   };

//   return (
//     <div>
//       <textarea ref={textAreaRef} /> {/* Textarea для EasyMDE */}
//       <div>
//         <button onClick={handleSave}>Сохранить</button>
//         <button onClick={onCancel}>Отмена</button>
//       </div>
//     </div>
//   );
// };

// export default EditReviewForm;

// import React, { useState, useMemo, useCallback } from "react";
// import { createEditor } from "slate"; // Основной редактор
// import { Slate, Editable, withReact } from "slate-react"; // React-интеграция
// import { withHistory } from "slate-history"; // Поддержка истории изменений

// const EditReviewForm = ({ review, onSave, onCancel }) => {
//   // Инициализация редактора
//   const editor = useMemo(() => withHistory(withReact(createEditor())), []);

//   // Начальное состояние редактора
//   const [value, setValue] = useState(
//     review.content
//       ? JSON.parse(review.content) // Если есть контент, загружаем его
//       : [
//           {
//             type: "paragraph",
//             children: [{ text: "" }], // Пустой редактор
//           },
//         ]
//   );

//   // Обработчик сохранения
//   const handleSave = () => {
//     const content = JSON.stringify(value); // Сохраняем состояние редактора
//     onSave(content);
//   };

//   // Рендер редактора
//   return (
//     <div>
//       <Slate editor={editor} value={value} onChange={(newValue) => setValue(newValue)}>
//         <Editable
//           placeholder="Введите текст..."
//           style={{
//             border: "1px solid #ddd",
//             padding: "10px",
//             minHeight: "200px",
//           }}
//         />
//       </Slate>
//       <div>
//         <button onClick={handleSave}>Сохранить</button>
//         <button onClick={onCancel}>Отмена</button>
//       </div>
//     </div>
//   );
// };

// export default EditReviewForm;

import React, { useState, useMemo, useRef } from "react";
import JoditEditor from "jodit-react";

const EditReviewForm = ({ review, onSave, onCancel }) => {
  const editor = useRef(null); // Ref для редактора
  const [content, setContent] = useState(review.content || ""); // Состояние для хранения контента

  // Конфигурация редактора
  const config = useMemo(
    () => ({
      readonly: false, // Редактор доступен для редактирования
      placeholder: "Введите текст...", // Подсказка
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "|",
        "link",
        "image",
        "|",
        "align",
        "|",
        "undo",
        "redo",
      ], // Настройка кнопок
    }),
    []
  );

  // Обработчик сохранения
  const handleSave = () => {
    onSave(content); // Передаем сохраненные данные
  };

  return (
    <div>
      <JoditEditor
        // ref={editor}
        value={content}
        config={config}
        onChange={(newContent) => setContent(newContent)}
      />
      <div>
        <button onClick={handleSave}>Сохранить</button>
        <button onClick={onCancel}>Отмена</button>
      </div>
    </div>
  );
};

export default EditReviewForm;