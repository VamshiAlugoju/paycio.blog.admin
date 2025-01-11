import React, { useState, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

interface ExampleProps {
  placeholder?: string;
  setFieldValue: any;
  initialContent?: string;
  editable?: boolean;
}

const editorDefaultStyles = `
      img , iframe {
        max-width: 100%;
        height: unset;
      }
    `;

const IdButton = {
  name: "Id", // Unique identifier for the button
  exec: (editor: any) => {
    const value = window.prompt("id");
    if (value != null) {
      const selection = editor.selection.sel;
      const selectedNode =
        selection?.anchorNode?.nodeType === 3
          ? selection.anchorNode.parentNode
          : selection?.anchorNode;
      selectedNode.id = value;
    }
  },
  tooltip: "Insert Id", 
};

const Editor: React.FC<ExampleProps> = ({
  placeholder,
  setFieldValue,
  initialContent,
  editable = false,
}) => {
  const editor = useRef<typeof JoditEditor | null>(null);
  const [content, setContent] = useState<string>(initialContent || "");

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
    }),
    [placeholder, editable]
  );

  return (
    <div>
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        tabIndex={1}  
        onBlur={(newContent: string) => {
          setContent(newContent);
          setFieldValue("content", newContent);
        }}
      />
      <div style={{ marginTop: "20px" }}>
        <h3>Content Preview:</h3>
        <div
          className="w-full break-all preview "
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            minHeight: "100px",
            background: "white",
            boxSizing: "border-box",
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default Editor;
