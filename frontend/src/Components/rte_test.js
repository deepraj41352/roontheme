import React, { useEffect } from 'react';
import RichTextEditor from 'react-rte';

export default function MyStatefulEditor({
  markup,
  value,
  onChange,
  clearEditor,
  setClearEditor,
}) {
  const [editorValue, setEditorValue] = React.useState(
    RichTextEditor.createValueFromString(markup, 'html')
  );

  useEffect(() => {
    if (clearEditor) {
      setEditorValue(RichTextEditor.createEmptyValue());
      setClearEditor(false);
    }
  }, [clearEditor, setClearEditor]);

  const handleEditorChange = (newValue) => {
    setEditorValue(newValue);
    if (onChange) {
      onChange(newValue.toString('html'));
    }
  };

  return (
    <div>
      <RichTextEditor value={editorValue} onChange={handleEditorChange} />
    </div>
  );
}
