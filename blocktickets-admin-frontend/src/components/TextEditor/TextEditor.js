import React from "react";

import { useQuill } from "react-quilljs";

import "quill/dist/quill.snow.css"; // Add css for snow theme
// or import 'quill/dist/quill.bubble.css'; // Add css for bubble theme

const TextEditor = ({ description, setDescription }) => {
  const modules = {
    toolbar: [["bold", "italic", "underline", "strike"]],
  };
  const placeholder = "Compose an epic hotel description...";
  const formats = ["bold", "italic", "underline", "strike"];
  const { quillRef, quill } = useQuill({ modules, formats, placeholder });

  React.useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        setDescription(quill.root.innerHTML);
      });
    }
    if (description && description.length > 0) {
      if (quill) {
        let des = quill.clipboard.convert(description);
        quill.setContents(des, "silent");
      }
    }
  }, [quill]);

  return (
    <div className="w-full h-75 mb-3">
      <div ref={quillRef} />
    </div>
  );
};

export default TextEditor;
