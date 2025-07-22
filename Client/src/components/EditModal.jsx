import React from "react";

function EditModal({ content, setContent, onCancel, onSave }) {
  return (
    <>
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center z-50">
        <div className="bg-white p-4 rounded shadow w-[90%] max-w-md">
          <h3 className="text-lg font-semibold mb-2">Edit your post</h3>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border p-2 rounded mb-4"
            rows={4}
          />
          <div className="flex justify-end gap-2">
            <button onClick={onCancel} className="text-gray-500">
              Cancel
            </button>
            <button
              onClick={onSave}
              className="bg-blue-500 text-white px-4 py-1 rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditModal;
