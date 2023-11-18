import React from "react";

import { useQuill } from "react-quilljs";

import "quill/dist/quill.snow.css"; // Add css for snow theme
// or import 'quill/dist/quill.bubble.css'; // Add css for bubble theme

const TextEditor = ({ getValues, setValue, name }) => {
  const modules = {
    toolbar: [["bold", "italic", "underline", "strike"]],
  };
  const placeholder = "Compose an epic hotel description...";
  const formats = ["bold", "italic", "underline", "strike"];
  const { quillRef, quill } = useQuill({ modules, formats, placeholder });

  React.useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        setValue(name, quill.root.innerHTML);
      });
    }
    const info = getValues(name);

    if (info && info.length > 0) {
      if (quill) {
        let des = quill.clipboard.convert(info);
        quill.setContents(des, "silent");
      }
    }
  }, [quill]);

  return (
    <div className="w-full h-full mb-3 bg-[#2b2b2b] !text-white rounded-lg">
      <div className="" ref={quillRef} />
    </div>
  );
};

export default TextEditor;
