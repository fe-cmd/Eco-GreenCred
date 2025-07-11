require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io"); // ✅ Correct import

 

const app = express();
const server = http.createServer(app);
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});


const io = new Server(server, {
  cors: { origin: '*' }, // or specify frontend URL
});

// 🧠 Global socket object (after io is initialized)
global.io = io;

// 🧠 Socket connection events
io.on('connection', (socket) => {
  console.log("User connected:", socket.id);

  socket.on('disconnect', () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection failed:", err));

// ✅ MongoDB models
const User = require("./models/User");
const Quiz = require("./models/Quiz");
const Admin = require("./models/Admin");
const QuizAttempt = require("./models/QuizAttempt");
const Post = require("./models/Post");


// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/ec26.png", express.static(path.join(__dirname, "public/ec26.png")));






// ✅ Directory setup
const UPLOADS_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);  

const PROFILE_DIR = path.join(UPLOADS_DIR, "profile");
const ADMIN_PROFILE_DIR = path.join(UPLOADS_DIR, "admins");
const ACTIVITY_DIR = UPLOADS_DIR;

[PROFILE_DIR, ADMIN_PROFILE_DIR, ACTIVITY_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ✅ Multer config
const userStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, PROFILE_DIR),
  filename: (req, file, cb) => cb(null, `${req.params.username}${path.extname(file.originalname)}`)
});
const uploadProfile = multer({ storage: userStorage });

const adminStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, ADMIN_PROFILE_DIR),
  filename: (_, file, cb) => cb(null, `admin${path.extname(file.originalname)}`)
});
const uploadAdminProfile = multer({ storage: adminStorage });

const uploadPost = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'eco_posts',
      resource_type: 'auto', // handles images and videos
    },
  }),
});

const uploadActivity = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'activity_uploads',
      resource_type: 'auto',
    },
  }),
});

// 📢 Public: get all posts
app.get('/eco-space/posts', async (_, res) => {
  const posts = await Post.find().sort({ timestamp: -1 });
  res.json(posts);
});

app.post('/eco-space/upload', uploadPost.array('media'), async (req, res) => {
  const { username, caption, isVideo } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.status(404).json({ message: "User not found." });

  const mediaPaths = req.files.map(file => file.path); // Cloudinary hosted URL

  const newPost = new Post({
  username,
  name: user.name,
  profileImage: user.profileImage,
  caption,
  isVideo: isVideo === 'true',
  media: mediaPaths,     // Now Cloudinary URLs
  likes: [],
  favorites: [],
  comments: [],
});


  await newPost.save();

  // 🔴 Notify all users to refresh posts
  io.emit('refresh-posts');

  res.json({ message: "Post uploaded!" });
});   

app.post('/eco-space/like', async (req, res) => {
  const { postId, username } = req.body;
  const post = await Post.findById(postId);

  if (!post) return res.status(404).json({ message: "Post not found." });

  if (post.likes.includes(username)) {
    post.likes = post.likes.filter(u => u !== username);
  } else {
    post.likes.push(username);
  }

  await post.save();

  // 🔴 Notify all users
  io.emit('refresh-posts');

  res.json({ likes: post.likes });
});  

app.post('/eco-space/favorite', async (req, res) => {
  const { postId, username } = req.body;
  const post = await Post.findById(postId);

  if (!post) return res.status(404).json({ message: "Post not found." });

  if (post.favorites.includes(username)) {
    post.favorites = post.favorites.filter(u => u !== username);
  } else {
    post.favorites.push(username);
  }

  await post.save();

  // 🔴 Notify all users
  io.emit('refresh-posts');

  res.json({ favorites: post.favorites });
});   

app.post('/eco-space/comment', async (req, res) => {
  const { postId, username, text } = req.body;
  const post = await Post.findById(postId);
  const user = await User.findOne({ username });

  if (!post || !user) return res.status(404).json({ message: "Post or user not found." });

  post.comments.push({
    username,
    profileImage: user.profileImage,
    text,
    replies: []
  });

  await post.save();

  // 🔴 Broadcast
  io.emit('refresh-posts');

  res.json({ comments: post.comments });
});  

// ↩️ Reply to comment
app.post('/eco-space/reply', async (req, res) => {
  const { postId, commentIndex, username, text } = req.body;

  if (commentIndex === undefined || commentIndex < 0) {
    return res.status(400).json({ message: "Invalid comment index." });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found." });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found." });

    if (!post.comments[commentIndex]) {
      return res.status(400).json({ message: "Comment does not exist." });
    }

    post.comments[commentIndex].replies.push({
      username,
      profileImage: user.profileImage,
      text,
    });

    await post.save();
    res.json({ comments: post.comments });

    io.emit("eco-posts-updated");
  } catch (err) {
    console.error("Reply error:", err);
    res.status(500).json({ message: "Server error." });
  }
});


// ✅ Signup
app.post("/signup", async (req, res) => {
  const { name, username, email, password, confirmPassword, phone, occupation } = req.body;
  if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match." });

  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) return res.status(400).json({ message: "Email or username already exists." });

  const newUser = new User({ name, username, email, password, phone, occupation });
  await newUser.save();
  res.json({ message: "Signup successful." });
});

// ✅ Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.password !== password)
    return res.status(400).json({ message: "Invalid credentials." });

  res.json({ message: "Login successful.", username: user.username });
});

// ✅ Reset Password
app.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password reset successful. Please login with your new password." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Get user profile
app.get("/user/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).json({ message: "User not found." });
  res.json(user);
});

// ✅ Profile upload
app.post("/upload-profile/:username", uploadProfile.single("image"), async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).json({ message: "User not found." });

  user.profileImage = `uploads/profile/${req.file.filename}`;
  await user.save();
  res.json({ message: "Profile updated", profileImage: user.profileImage });
});

// ✅ Activity upload
app.post("/upload-activity", uploadActivity.array("files", 5), async (req, res) => {
  const { username, activityType, description } = req.body;
  const files = req.files;

  if (!files || files.length === 0)
    return res.status(400).json({ message: "No files uploaded." });

  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: "User not found." });

  const groupId = Date.now();
  const uploads = files.map(file => ({
    id: Date.now() + Math.random(),
    activityType,
    description,
    filePath: file.path,  // ✅ Cloudinary URL
    fileType: file.mimetype.startsWith("video") ? "video" : "image",
    fileGroupId: groupId,
    status: "pending",
    points: 0,
    timestamp: new Date().toISOString()
  }));

  user.uploads.push(...uploads);
  await user.save();

  res.json({ message: "Upload(s) received", uploads });
});




// ✅ Admin login
app.post("/admin-login", async (req, res) => {
  const { username, password } = req.body;
  const expectedPassword = "eco#1gr33ner$y";
  const isValid = await bcrypt.compare(password, bcrypt.hashSync(expectedPassword, 10));
  if (!isValid) return res.status(401).json({ message: "Invalid admin credentials." });

  let admin = await Admin.findOne({ username });
  if (!admin) admin = await Admin.create({ username });
  res.json({ message: "Admin login successful." });
});

// ✅ Admin profile upload
app.post("/admin/upload-profile", uploadAdminProfile.single("image"), async (req, res) => {
  const imagePath = `uploads/admins/${req.file.filename}`;
  const admin = await Admin.findOneAndUpdate({}, { profileImage: imagePath }, { new: true, upsert: true });
  res.json({ message: "Admin profile uploaded", profileImage: admin.profileImage });
});

app.get("/admin/profile", async (_, res) => {
  const admin = await Admin.findOne();
  res.json({ profileImage: admin?.profileImage || "/ec26.png" });
});

// ✅ Admin view uploads
app.get("/admin/uploads", async (_, res) => {
  const users = await User.find();
  const uploads = [];

  users.forEach(user => {
    (user.uploads || []).forEach(upload => {
      uploads.push({
        ...upload.toObject(),
        username: user.username,
        name: user.name,
        profileImage: user.profileImage || "/ec26.png"
      });
    });
  });

  res.json(uploads);
});

// ✅ Admin approve
app.post("/admin/approve", async (req, res) => {
  const { username, uploadId, points } = req.body;
  const user = await User.findOne({ username });
  const upload = user.uploads.find(u => u.id === uploadId);
  upload.status = "approved";
  upload.points = Number(points);
  user.points += Number(points);
  await user.save();
  res.json({ success: true });
});

// ✅ Admin decline
app.post("/admin/decline", async (req, res) => {
  const { username, uploadId } = req.body;
  const user = await User.findOne({ username });
  const upload = user.uploads.find(u => u.id === uploadId);
  upload.status = "declined";
  await user.save();
  res.json({ success: true });
});

app.get("/upload/:username/:uploadId", async (req, res) => {
  const { username, uploadId } = req.params;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: "User not found." });

  const upload = user.uploads.find(u => u.id == uploadId);
  if (!upload) return res.status(404).json({ message: "Upload not found." });

  res.json(upload);
});


// ✅ Leaderboard (works permanently now)
app.get('/leaderboard', async (req, res) => {
  const range = req.query.range || 'all';
  const now = new Date();

  try {
    const users = await User.find();
    const quizAttempts = await QuizAttempt.find();

    const leaderboardData = users.map(user => {
      let total = 0;

      // ✅ 1. Add quiz points within the range
      const validQuizAttempts = quizAttempts.filter(attempt => {
        if (attempt.username !== user.username) return false;
        const quizDate = new Date(attempt.timestamp);

        if (range === 'weekly') {
          return quizDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else if (range === 'monthly') {
          return quizDate >= new Date(now.getFullYear(), now.getMonth(), 1);
        }
        return true; // 'all'
      });

      const quizPoints = validQuizAttempts.reduce((sum, a) => sum + (a.score || 0), 0);
      total += quizPoints;

      // ✅ 2. Add upload points within the range
      const validUploads = (user.uploads || []).filter(upload => {
        if (upload.status !== 'approved') return false;
        const uploadDate = new Date(upload.timestamp);

        if (range === 'weekly') {
          return uploadDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else if (range === 'monthly') {
          return uploadDate >= new Date(now.getFullYear(), now.getMonth(), 1);
        }
        return true;
      });

      const uploadPoints = validUploads.reduce((sum, u) => sum + (u.points || 0), 0);
      total += uploadPoints;

      return {
        username: user.username,
        name: user.name,
        profileImage: user.profileImage || 'ec26.png',
        points: total
      };
    });

    // ✅ Sort and rank
    leaderboardData.sort((a, b) => b.points - a.points);
    let currentRank = 1, lastPoints = null;

    const ranked = leaderboardData.map((user, index) => {
      if (user.points !== lastPoints) currentRank = index + 1;
      lastPoints = user.points;
      return { ...user, rank: currentRank };
    });

    res.json(ranked);
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ message: "Error loading leaderboard." });
  }
});



// ✅ Start Quiz (MongoDB version)
app.get("/quiz/start/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const attempt = await QuizAttempt.findOne({ username });
    const now = new Date();

    // Check if the user has already taken the quiz in the last 24 hours
    if (
      attempt &&
      new Date(attempt.timestamp).getTime() > now.getTime() - 24 * 60 * 60 * 1000
    ) {
      return res.json({ message: "You have already taken the quiz today. Please try again after 24 hours." });
    }

    const questions = await Quiz.find();
    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, 10);

    // Send only question + options + answer for immediate feedback (optional)
    const formatted = shuffled.map(q => ({
      question: q.question,
      options: q.options,
      answer: q.answer // Only if you want frontend to check correctness
    }));

    res.json({ questions: formatted });
  } catch (err) {
    console.error("Quiz start error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Submit Quiz (MongoDB version)
app.post("/quiz/submit/:username", async (req, res) => {
  const { username } = req.params;
  const { answers } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const allQuestions = await Quiz.find();
    let score = 0;

    answers.forEach(({ question, selected }) => {
      const original = allQuestions.find(q => q.question === question);
      if (original && original.answer === selected) score++;
    });

    user.points += score;
    await user.save();

    // Save or update attempt
    await QuizAttempt.findOneAndUpdate(
      { username },
      { username, score, timestamp: new Date() },
      { upsert: true, new: true }
    );

    res.json({ message: "Quiz submitted successfully.", score });
  } catch (err) {
    console.error("Quiz submit error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Add this route to support polling
app.get("/check-status/:username", async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: "User not found." });

  const newApproved = user.uploads.find(u => u.status === "approved" && !u.notified);
  const newDeclined = user.uploads.find(u => u.status === "declined" && !u.notified);

  if (newApproved || newDeclined) {
    const status = newApproved ? "approved" : "declined";
    const message = newApproved
      ? "🎉 Your recent upload has been approved!"
      : "❌ Sorry, your recent upload was declined.";
    
    // ✅ Mark as notified (so we don’t alert twice)
    if (newApproved) newApproved.notified = true;
    if (newDeclined) newDeclined.notified = true;
    await user.save();

    return res.json({ message });
  }

  return res.json({}); // no new updates
});

// ✅ Test
app.get("/api/test", (_, res) => {
  res.json({ message: "Backend is working!" });
});

// ✅ Serve React build
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

// ✅ Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
