import React from "react";
import { Editor, EditorState, convertFromRaw } from "draft-js";

const PostContent = ({ content }: any) => {
  let editorState;

  try {
    const rawContent = JSON.parse(content); // Assuming the content is stored as JSON
    const contentState = convertFromRaw(rawContent);
    editorState = EditorState.createWithContent(contentState);
  } catch (error) {
    console.error("Error parsing content:", error);
    editorState = EditorState.createEmpty(); // Fallback to empty state if error
  }

  // Dummy onChange function to satisfy the required prop
  const handleChange = (newState: any) => {
    // Editor is read-only, so no actual change will happen
  };

  return (
    <Editor
      editorState={editorState}
      onChange={handleChange} // Providing the required onChange prop
      readOnly={true} // Keeping the editor read-only
    />
  );
};

export default PostContent;
