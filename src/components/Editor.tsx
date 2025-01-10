import React, { useState, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';

interface ExampleProps {
  placeholder?: string;
  setFieldValue: any;
  initialContent ?:string;
  editable ?:boolean;
}

const Editor: React.FC<ExampleProps> = ({ placeholder, setFieldValue , initialContent , editable = false }) => {
  const editor = useRef< typeof JoditEditor | null>(null);
  const [content, setContent] = useState<string>(initialContent || ""  );
  console.log(content)
  const config = useMemo(
    () => ({
      defaultStyle:"text-align: left",
      readonly: editable, // Enable editing
      placeholder: placeholder || 'Start typing...',
      toolbarSticky: true, // Sticky toolbar for convenience
      toolbarAdaptive: false, // Ensures all tools are visible
      showCharsCounter: true, // Character count
      showWordsCounter: true, // Word count
      showXPathInStatusbar: false, // Disable XPath in status bar
    }),
    [placeholder , editable]
  );

  return (
    <div>
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        tabIndex={1} // Tab index for accessibility
        onBlur={(newContent) => setContent(newContent)} // Updates content on blur
        onChange={(newContent) => { setContent(newContent) ; setFieldValue("content", newContent)}} // Updates content in real-time
      />
      <div style={{ marginTop: '20px' }}>
        <h3>Content Preview:</h3>
        <div
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            minHeight: '100px',
            background: '#f9f9f9',
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default Editor;