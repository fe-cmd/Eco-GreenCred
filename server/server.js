const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const multer = require('multer');



const app = express();
const PORT = 5000;
const USERS_FILE = path.join(__dirname, 'users.json');
const ADMIN_FILE = path.join(__dirname, 'admin.json');
const PROFILE_DIR = path.join(__dirname, 'uploads/profile');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const ADMIN_PROFILE_DIR = path.join(__dirname, 'uploads/admins');

const QUIZ_FILE = path.join(__dirname, 'quiz.json');
const QUIZ_ATTEMPT_FILE = path.join(__dirname, 'quiz-attempts.json');






app.use(cors()); // Enable CORS for all routes
app.use(express.json());
// Serve profile images + default
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/ec26.png', express.static(path.join(__dirname, 'public/ec26.png')));
// For activity uploads
app.use('/uploads', express.static(UPLOADS_DIR));


// Utility to read and write quiz attempt log
function getQuizAttempts() {
  if (!fs.existsSync(QUIZ_ATTEMPT_FILE)) return {};
  return JSON.parse(fs.readFileSync(QUIZ_ATTEMPT_FILE, 'utf-8'));
}

function saveQuizAttempts(attempts) {
  fs.writeFileSync(QUIZ_ATTEMPT_FILE, JSON.stringify(attempts, null, 2));
}

function hasTakenToday(lastTime) {
  if (!lastTime) return false;
  const last = new Date(lastTime);
  const now = new Date();
  const diff = (now - last) / (1000 * 60 * 60);
  return diff < 24;
}

app.get('/quiz/start/:username', (req, res) => {
  const { username } = req.params;
  const users = getUsers();
  const user = users.find(u => u.username === username);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const attempts = getQuizAttempts();
  const lastTime = attempts[username];
  if (hasTakenToday(lastTime)) {
    return res.json({ message: 'You have already taken the quiz today. Please try again after 24 hours.' });
  }

  const questions = JSON.parse(fs.readFileSync(QUIZ_FILE, 'utf-8'));
  const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, 10);
  const stripped = shuffled.map(q => ({
    question: q.question,
    options: q.options,
    answer: q.answer  // Include the answer for frontend immediate feedback

  }));

  res.json({ questions: stripped });
});

app.post('/quiz/submit/:username', (req, res) => {
  const { username } = req.params;
  const { answers } = req.body; // array of { question, selected }

  const users = getUsers();
  const user = users.find(u => u.username === username);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const allQuestions = JSON.parse(fs.readFileSync(QUIZ_FILE, 'utf-8'));
  let score = 0;

  answers.forEach(({ question, selected }) => {
    const original = allQuestions.find(q => q.question === question);
    if (original && original.answer === selected) {
      score++;
    }
  });

  // Update points and save
  user.points = (user.points || 0) + score;
  saveUsers(users);

  // Log quiz attempt
  const attempts = getQuizAttempts();
  attempts[username] = new Date().toISOString();
  saveQuizAttempts(attempts);

  res.json({ message: 'Quiz submitted successfully.', score });
});



// Initialize default admin on first run
if (!fs.existsSync(ADMIN_FILE)) {
  const defaultAdmin = {
    username: "admin",
    passwordHash: bcrypt.hashSync("eco#1gr33ner$y", 10)
  };
  fs.writeFileSync(ADMIN_FILE, JSON.stringify({ admins: [], profileImage: ""  }, null, 2));
}

if (!fs.existsSync(PROFILE_DIR)) fs.mkdirSync(PROFILE_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, PROFILE_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.params.username}${ext}`);
  }
});
const upload = multer({ storage });


if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Rename storage to avoid conflict
const uploadsDiskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Rename upload to avoid conflict
const activityUploadHandler = multer({ storage: uploadsDiskStorage });


if (!fs.existsSync(ADMIN_PROFILE_DIR)) fs.mkdirSync(ADMIN_PROFILE_DIR, { recursive: true });

const adminProfileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, ADMIN_PROFILE_DIR),
  filename: (req, file, cb) => cb(null, `admin${path.extname(file.originalname)}`)
});
const adminUpload = multer({ storage: adminProfileStorage });

app.post('/upload-profile/:username', upload.single('image'), (req, res) => {
  const users = getUsers();
  const user = users.find(u => u.username === req.params.username);
  if (!user) return res.status(404).json({ message: "User not found." });

  user.profileImage = `uploads/profile/${req.file.filename}`;
  saveUsers(users);

  res.json({ message: "Profile updated", profileImage: user.profileImage });
});


app.post('/upload-activity', activityUploadHandler.single('file'), (req, res) => {
  const { username, activityType, description } = req.body;
  const filePath = `/uploads/${req.file.filename}`;

  const users = getUsers();
  const userIndex = users.findIndex(u => u.username === username);
  if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

  const newUpload = {
    id: Date.now(),
    activityType,
    description,
    filePath,
    fileType: req.file.mimetype.startsWith('video') ? 'video' : 'image',
    status: 'pending',
    points: 0,
    timestamp: new Date().toISOString()
  };

  users[userIndex].uploads = users[userIndex].uploads || [];
  users[userIndex].uploads.push(newUpload);
  saveUsers(users);

  res.json({ message: 'Upload received', upload: newUpload });
});


let lastStatus = {}; // In-memory user status messages

app.get('/check-status/:username', (req, res) => {
  const { username } = req.params;
  const users = getUsers();
  const user = users.find(u => u.username === username);
  if (!user || !user.uploads) return res.json({});

  const last = lastStatus[username] || {};

  for (const upload of user.uploads) {
    if (upload.status !== "pending" && (!last[upload.id] || last[upload.id] !== upload.status)) {
      lastStatus[username] = { ...last, [upload.id]: upload.status };
      return res.json({ message: `Your upload was ${upload.status}!` });
    }
  }

  return res.json({});
});

app.get('/user/:username', (req, res) => {
  const users = getUsers(); // reads users.json
  const user = users.find(u => u.username === req.params.username);

  if (!user) return res.status(404).json({ message: "User not found." });

  res.json(user); // returns full user object
});




app.post('/admin-login', async (req, res) => {
  const { username, password } = req.body;

  const expectedPassword = "eco#1gr33ner$y";
  const isValid = await bcrypt.compare(password, bcrypt.hashSync(expectedPassword, 10));

  if (!isValid) {
    return res.status(401).json({ message: "You are not an admin, kindly go back to select users mode." });
  }

  // Load current admins
  const adminData = JSON.parse(fs.readFileSync(ADMIN_FILE, "utf-8"));
  const admins = adminData.admins || [];

  // Save new admin if not already in file
  if (!admins.includes(username)) {
    admins.push(username);
    adminData.admins = admins;
    fs.writeFileSync(ADMIN_FILE, JSON.stringify(adminData, null, 2));
  }

  res.json({ message: "Admin login successful." });
});

app.post('/admin/upload-profile', adminUpload.single('image'), (req, res) => {
  const imagePath = `uploads/admins/${req.file.filename}`;
  const adminData = JSON.parse(fs.readFileSync(ADMIN_FILE, 'utf-8'));
  adminData.profileImage = imagePath;
  fs.writeFileSync(ADMIN_FILE, JSON.stringify(adminData, null, 2));
  res.json({ message: "Admin profile uploaded", profileImage: imagePath });
});

app.get('/admin/profile', (req, res) => {
  const adminData = JSON.parse(fs.readFileSync(ADMIN_FILE, 'utf-8'));
  res.json({ profileImage: adminData.profileImage || '/ec26.png' });
});

app.get('/admin/uploads', (req, res) => {
  const users = getUsers();
  const allUploads = [];

  users.forEach(user => {
    if (user.uploads && user.uploads.length > 0) {
      user.uploads.forEach(upload => {
        allUploads.push({
          ...upload,
          username: user.username,
          name: user.name,
          profileImage: user.profileImage || '/ec26.png'
        });
      });
    }
  });

  res.json(allUploads);
});

// Approve upload with points
app.post('/admin/approve', async (req, res) => {
  const { username, uploadId, points } = req.body;
  const users = getUsers();
  const user = users.find(u => u.username === username);
  const upload = user.uploads.find(u => u.id === uploadId);

  upload.status = 'approved';
  upload.points = Number(points);
  user.points = (user.points || 0) + Number(points); // Add to user total
  saveUsers(users);

  res.json({ success: true });
});

// Decline upload
app.post('/admin/decline', (req, res) => {
  const { username, uploadId } = req.body;
  const users = getUsers();
  const user = users.find(u => u.username === username);
  const upload = user.uploads.find(u => u.id === uploadId);

  upload.status = 'declined';
  saveUsers(users);

  res.json({ success: true });
});


// Utility: read users
function getUsers() {
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  return JSON.parse(data || '[]');
}

// Utility: save users
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Signup route
app.post('/signup', (req, res) => {
  const { name, username, email, password, confirmPassword, phone, occupation } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  const users = getUsers();

  const emailExists = users.some(user => user.email === email);
  const usernameExists = users.some(user => user.username === username);

  if (emailExists) {
    return res.status(400).json({ message: "Email has already been registered." });
  }

  if (usernameExists) {
    return res.status(400).json({ message: "Username is already taken." });
  }

  const newUser = { name, username, email, password, phone, occupation, points: 0, uploads: []  };
  users.push(newUser);
  saveUsers(users);

  res.json({ message: "Signup successful." });
});



// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = getUsers();

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials." });
  }

  res.json({ message: "Login successful.", username: user.username });
});

app.get('/user/:username', (req, res) => {
  const users = getUsers();
  const user = users.find(u => u.username === req.params.username);
  if (!user) return res.status(404).json({ message: "User not found." });
  res.json(user);
});

app.get('/leaderboard', (req, res) => {
  const range = req.query.range || 'all'; // "weekly", "monthly", or "all"
  const now = new Date();

  const users = getUsers();
  const quizAttempts = getQuizAttempts(); // for quiz timestamps

  const leaderboardData = users.map(user => {
    let total = 0;

    // 1. Include quiz points if within the range
    const quizTaken = quizAttempts[user.username];
    if (quizTaken) {
      const quizDate = new Date(quizTaken);
      const isValidQuiz = (
        (range === 'weekly' && quizDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)) ||
        (range === 'monthly' && quizDate >= new Date(now.getFullYear(), now.getMonth(), 1)) ||
        range === 'all'
      );

      if (isValidQuiz) {
        // Find score from user.points minus all approved uploads
        const uploads = (user.uploads || []).filter(u => u.status === 'approved');
        const uploadPoints = uploads.reduce((sum, up) => sum + (up.points || 0), 0);
        total += (user.points || 0) - uploadPoints;
      }
    }

    // 2. Include upload points if within the range
    const validUploads = (user.uploads || []).filter(upload => {
      if (upload.status !== 'approved') return false;
      const uploadDate = new Date(upload.timestamp);

      if (range === 'weekly') {
        return uploadDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (range === 'monthly') {
        return uploadDate >= new Date(now.getFullYear(), now.getMonth(), 1);
      }
      return true; // for 'all'
    });

    total += validUploads.reduce((sum, u) => sum + (u.points || 0), 0);

    return {
      username: user.username,
      name: user.name,
      profileImage: user.profileImage || 'ec26.png',
      points: total
    };
  });

  // Sort and rank
  leaderboardData.sort((a, b) => b.points - a.points);

  let currentRank = 1;
  let lastPoints = null;
  let sameRankCount = 0;

  const ranked = leaderboardData.map((user, index) => {
    if (user.points === lastPoints) {
      sameRankCount++;
    } else {
      currentRank = index + 1;
      sameRankCount = 0;
    }
    lastPoints = user.points;

    return { ...user, rank: currentRank };
  });

  res.json(ranked);
});






app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Serve frontend build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
