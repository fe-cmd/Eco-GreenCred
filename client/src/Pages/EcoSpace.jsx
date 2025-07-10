import React, { useEffect, useState } from 'react';
import './CSS/EcoSpace.css';
import Navbar from './Navbar';
import Footer from './Footer';
import { useNavigate, useParams } from 'react-router-dom';
import { FiCamera, FiVideo, FiHeart, FiMessageCircle, FiDownload } from 'react-icons/fi';
import { FaThumbsUp } from 'react-icons/fa';
import social from '../Components/Assets/social.png';

import { io } from 'socket.io-client';

const API = process.env.REACT_APP_API || 'http://localhost:5000';
const socket = io(API); 

const EcoSpace = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [showComments, setShowComments] = useState({});
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [caption, setCaption] = useState("");
  const [isVideo, setIsVideo] = useState(false);
  const [newComment, setNewComment] = useState({});
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    fetch(`${API}/eco-space/posts`)
      .then(res => res.json())
      .then(setPosts);

       // ✅ Listen for server broadcast
    socket.on("eco-posts-updated", () => {
      fetch(`${API}/eco-space/posts`)
        .then(res => res.json())
        .then(setPosts);
    });

    // ✅ Cleanup on unmount

      // Listen for refresh event
  socket.on('refresh-posts', () => {
    fetch(`${API}/eco-space/posts`)
      .then(res => res.json())
      .then(setPosts);
  });

  return () => {
    socket.off('refresh-posts');
    socket.off("eco-posts-updated");
  };

  }, []);

  const refreshPosts = () => {
    fetch(`${API}/eco-space/posts`)
      .then(res => res.json())
      .then(setPosts);
  };

  const toggleLike = async (postId) => {
    await fetch(`${API}/eco-space/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, username })
    });
    refreshPosts();
  };

  const toggleFavorite = async (postId) => {
    await fetch(`${API}/eco-space/favorite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, username })
    });
    refreshPosts();
  };

  const toggleComments = (id) => {
    setShowComments(prev => ({ ...prev, [id]: !prev[id] }));
  };

 const handleDownload = (url) => {
  const fullUrl = `${API}${url}`;
  fetch(fullUrl)
    .then(res => res.blob())
    .then(blob => {
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = url.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch(err => console.error("Download failed", err));
};


  const handleMediaUpload = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === "video") {
      if (files.length > 1 || !files[0].type.startsWith("video")) return alert("Only one video allowed");
      setIsVideo(true);
    } else {
      if (files.length > 5) return alert("Maximum of 5 images");
      setIsVideo(false);
    }
    setSelectedMedia(files);
  };

  const handleSubmitPost = async () => {
    if (!caption || !selectedMedia.length) return alert("Enter caption and select media");

    const formData = new FormData();
    formData.append("username", username);
    formData.append("caption", caption);
    formData.append("isVideo", isVideo);
    selectedMedia.forEach(file => formData.append("media", file));

    const res = await fetch(`${API}/eco-space/upload`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    if (res.ok) {
      alert("Post uploaded!");
      setCaption("");
      setSelectedMedia([]);
      refreshPosts();
    } else {
      alert(data.message || "Upload failed.");
    }
  };

  const handleCommentChange = (postId, text) => {
    setNewComment(prev => ({ ...prev, [postId]: text }));
  };

  const handleSubmitComment = async (postId) => {
    const text = newComment[postId];
    if (!text) return;

    await fetch(`${API}/eco-space/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, username, text })
    });

    setNewComment(prev => ({ ...prev, [postId]: "" }));
    refreshPosts();
  };

  const handleReplyChange = (commentIndex, text) => {
  setReplyText(prev => ({ ...prev, [commentIndex]: text }));
};

const handleSubmitReply = async (postId, commentIndex) => {
  const text = replyText[commentIndex];
  if (!text) return;

  try {
    const res = await fetch(`${API}/eco-space/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, commentIndex, username, text })
    });

    if (!res.ok) {
      const error = await res.json();
      alert(error.message || "Failed to reply.");
      return;
    }

    setReplyText(prev => ({ ...prev, [commentIndex]: "" }));
    refreshPosts();
  } catch (err) {
    console.error("Reply error:", err);
  }
};

  return (
    <div className="eco-container" style={{ backgroundImage: `url(${social})` }}>
      <Navbar />

      <div className="eco-card-top">
        <div className="eco-icons">
          <label>
            <FiCamera />
            <input type="file" accept="image/*" multiple onChange={(e) => handleMediaUpload(e, 'image')} />
          </label>
          <label>
            <FiVideo />
            <input type="file" accept="video/*" onChange={(e) => handleMediaUpload(e, 'video')} />
          </label>
        </div>
        <div className="eco-info">
          <span className="back-arrow3" onClick={() => navigate(`/dashboard/${username}`)}>←</span>
          <h3>Share your eco-activities</h3>
          <p>Post images or videos of your green impact to inspire others!</p>
        </div>
      </div>

      {selectedMedia.length > 0 && (
        <div className="eco-preview-box">
          {isVideo ? (
            <video src={URL.createObjectURL(selectedMedia[0])} controls className="eco-preview" />
          ) : (
            selectedMedia.map((file, i) => (
              <img key={i} src={URL.createObjectURL(file)} className="eco-preview" />
            ))
          )}
          <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Write a caption..." />
          <button onClick={handleSubmitPost}>Post</button>
        </div>
      )}

      <div className="eco-feed">
        {posts.map(post => (
          <div key={post._id} className="eco-post">
            <div className="eco-header">
              <img src={`${API}/${post.profileImage}`} alt="dp" className="eco-profile" />
              <span className="eco-name">{post.name}</span>
            </div>

            {post.isVideo ? (
              <video controls className="eco-media"><source src={`${API}${post.media[0]}`} /></video>
            ) : (
              <div className="eco-gallery">
                {post.media.map((m, i) => (
                  <img key={i} src={`${API}${m}`} alt="eco" className="eco-image" />
                ))}
              </div>
            )}

            <p className="eco-caption">{post.caption}</p>

            <div className="eco-actions">
              <div onClick={() => toggleFavorite(post._id)}><FaThumbsUp /> {post.favorites.length}</div>
              <div onClick={() => toggleLike(post._id)}><FiHeart /> {post.likes.length}</div>
              <div onClick={() => toggleComments(post._id)}><FiMessageCircle /> {post.comments.length}</div>
              <div onClick={() => handleDownload(post.media[0])}><FiDownload /></div>
              
            </div>

            {showComments[post._id] && (
  <div className="eco-comments">
    {post.comments.map((c, ci) => (
      <div key={ci}>
        <div className="eco-comment">
          <img src={`${API}/${c.profileImage}`} className="eco-profile" />
          <strong>{c.username}</strong>: {c.text}
        </div>

        {/* Replies */}
        {c.replies.map((r, ri) => (
          <div key={ri} className="eco-reply">
            <img src={`${API}/${r.profileImage}`} className="eco-profile" />
            <strong>{r.username}</strong>: {r.text}
          </div>
        ))}

        {/* ✅ Reply input using commentIndex (ci) */}
        <div className="eco-reply-input">
          <input
            type="text"
            placeholder="Reply..."
            value={replyText[ci] || ""}
            onChange={(e) => handleReplyChange(ci, e.target.value)}
          />
          <button onClick={() => handleSubmitReply(post._id, ci)}>Reply</button>
        </div>
      </div>
    ))}

    {/* ✅ Comment input remains unchanged */}
    <div className="eco-comment-input">
      <input
        type="text"
        placeholder="Add a comment..."
        value={newComment[post._id] || ""}
        onChange={(e) => handleCommentChange(post._id, e.target.value)}
      />
      <button onClick={() => handleSubmitComment(post._id)}>Post</button>
    </div>
  </div>
)}

          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default EcoSpace;
