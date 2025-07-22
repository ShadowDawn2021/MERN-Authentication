import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import EditModal from "./editModal";
import DeleteModal from "./deleteModal";

function Feed() {
  const { backendUrl, userData } = useContext(AppContext);
  const [posts, setPosts] = useState([]);
  const [newContent, setNewContent] = useState("");
  const [editingId, setEditingId] = useState(null); // 🔧 MODIFIED
  const [editingContent, setEditingContent] = useState(""); // 🔧 MODIFIED
  const [postToDelete, setPostToDelete] = useState(null);
  const [searchItem, setSearchItem] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/posts", {
        withCredentials: true,
      });

      setPosts(data.posts);
    } catch (err) {
      toast.error(err.message + ":Failed to load posts");
    }
  };

  const handleCreatePost = async () => {
    try {
      await axios.post(
        backendUrl + "/api/posts/create",
        { content: newContent },
        { withCredentials: true }
      );
      setNewContent("");
      fetchPosts();
    } catch (err) {
      toast.error(err.message + ": Error creating post");
    }
  };

  const handleEditPost = (id, content) => {
    setEditingId(id); // 🔧 MODIFIED
    setEditingContent(content); // 🔧 MODIFIED
  };

  const handleSaveEdit = async () => {
    if (!editingContent) return;
    try {
      await axios.put(
        backendUrl + `/api/posts/${editingId}`,
        { content: editingContent },
        { withCredentials: true }
      );
      setEditingId(null); // 🔧 MODIFIED
      setEditingContent(""); // 🔧 MODIFIED
      fetchPosts();
    } catch (err) {
      toast.error(err.message + " Error editing post");
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await axios.delete(backendUrl + `/api/posts/${id}`, {
        withCredentials: true,
      });
      fetchPosts();
    } catch (err) {
      toast.error(err.message + " Error deleting post");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      {/* Create Post */}
      <div className="flex flex-col gap-2 mb-6">
        <textarea
          className="border p-2 rounded"
          placeholder="What's on your mind?"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (newContent.trim()) {
                handleCreatePost();
              }
            }
          }}
        />
        <button
          onClick={handleCreatePost}
          disabled={!newContent.trim()}
          className={`px-4 py-2 rounded text-white transition 
    ${!newContent.trim() ? "bg-blue-300 " : "bg-blue-500 hover:bg-blue-600"}
  `}
        >
          Post
        </button>
      </div>

      <div className="mb-4">
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Looking for something?"
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
        />
      </div>

      {/* Edit Modal */}
      {editingId && (
        <EditModal
          content={editingContent}
          setContent={setEditingContent}
          onCancel={() => {
            setEditingId(null);
            setEditingContent("");
          }}
          onSave={handleSaveEdit}
        />
      )}
      {/* Delete Model */}
      {postToDelete && (
        <DeleteModal
          onCancel={() => setPostToDelete(null)}
          onConfirm={async () => {
            await handleDeletePost(postToDelete._id);
            setPostToDelete(null);
          }}
        />
      )}

      {/* Post List */}
      {posts
        .filter((post) => {
          const contentMatch = post.content
            ?.toString()
            .toLowerCase()
            .includes(searchItem.toLowerCase());
          const nameMatch = post.userId?.name
            .toLowerCase()
            .includes(searchItem.toLowerCase());
          return contentMatch || nameMatch;
        })
        .map((post) => (
          <div
            key={post._id}
            className="bg-white shadow p-4 mb-4 rounded flex flex-col"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{post.userId.name}</span>
              <span className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="mb-2">{post.content}</p>

            {post.userId._id?.toString() === userData._id?.toString() && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditPost(post._id, post.content)}
                  className="text-blue-500 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => setPostToDelete(post)}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}

export default Feed;
