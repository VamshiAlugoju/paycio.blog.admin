import React, { useState, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

interface EditorProps {
  placeholder?: string;
  setFieldValue: any;
  initialContent?: string;
  editable?: boolean;
  addTableOfContent?(id: string): void;
}

const editorDefaultStyles = `
      img , iframe {
        max-width: 100%;
        height: unset;
      }
    `;

const Editor: React.FC<EditorProps> = ({
  placeholder,
  setFieldValue,
  initialContent,
  editable = false,
  addTableOfContent,
}) => {
  const [content, setContent] = useState<string>(initialContent || "");
  const IdButton = {
    name: "Id",
    exec: (editor: any) => {
      const value = window.prompt("id");
      if (value != null) {
        const selection = editor.selection.sel;
        const selectedNode =
          selection?.anchorNode?.nodeType === 3
            ? selection.anchorNode.parentNode
            : selection?.anchorNode;
        const validId = purifyId(value).substring(0,30);
        selectedNode.id = validId;

        addTableOfContent && addTableOfContent(validId);
      }
    },
    tooltip: "Insert Id",
  };

  const config = useMemo(
    () => ({
      defaultStyle: editorDefaultStyles,
      readonly: editable, // Enable editing
      placeholder: placeholder || "Start typing...",
      toolbarAdaptive: false,
      showCharsCounter: true, // Character count
      showWordsCounter: true, // Word count
      showXPathInStatusbar: false, // Disable XPath in status bar;
      extraButtons: [IdButton],
      height: "100vh",
    }),
    [placeholder, editable]
  );

  return (
    <div>
      <JoditEditor
        value={content}
        config={config}
        // tabIndex={1}
        onBlur={(newContent: string) => {
          setContent(newContent);
          setFieldValue("content", newContent);
        }}
      />
    </div>
  );
};

export default Editor;

function purifyId(inputId: string) {
  let id = inputId.trim();
  id = id.replace(/\s+/g, "-");
  id = id.replace(/[^a-zA-Z0-9-_]/g, "");

  if (/^[0-9]/.test(id)) {
    id = `id-${id}`; // Prefix with 'id-' to avoid starting with a number
  }
  id = id.toLowerCase();

  return id;
}
