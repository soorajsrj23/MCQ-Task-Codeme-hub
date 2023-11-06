const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer = require('multer');
const cors = require('cors');
const jwt = require("jsonwebtoken");



const app = express();
const port = 4000;
app.use(express.json());


const User=require('./models/User')
const Question = require('./models/Question')

const UserResults = require('./models/UserResults'); // Import the UserResults model

// Connect to MongoDB
const dbURI = "mongodb://localhost/mcq";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Create a user schema and model





app.use(cors());
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, "secret-key");
    const userId = payload.userId;
    console.log("token is ", userId);

    // Find the user by ID
    const user = await User.findById(userId);
    console.log("token is ", user);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Remove the image data from the user object
    const modifiedUser = { ...user._doc };

    req.user = modifiedUser;
    next();
  } catch (error) {
    console.log("errrrrr");
    res.status(401).json({ error: "Unauthorized" });
  }
};



app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;


  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email }).maxTimeMS(30000);
   
    if (existingUser) {
      return res.status(400).send('Email already registered.');
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      

    });

    await newUser.save();
  
    const token = jwt.sign({ userId: newUser._id }, "secret-key");
    res.setHeader("Authorization", token);
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user.');
  }
 
});




app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email }).maxTimeMS(30000);
    console.log(user);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare the password

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, "secret-key");

    // Set the token in the response header
    
    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred during login" });
  }
});

// Admin verification route
app.put('/admin/verify-user/:userId', async (req, res) => {
  const { userId } = req.params;
  
  // Check if the user is an admin (you can implement this with middleware)
  const isAdmin = true; // Example: Check if the user has admin privileges

  if (!isAdmin) {
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    user.isVerified = true; // Set the user as verified
    await user.save();

    res.status(200).json({ message: 'User verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.get("/current-user", authenticate, async (req, res) => {
  res.status(200).json(req.user);
});

app.get("/current-user-verification", authenticate, async (req, res) => {
  const currentUser = req.user;
  
  if (currentUser && currentUser.isVerified !== undefined) {
    // Check if the user is verified
    res.status(200).json({
      ...currentUser,
      isVerified: currentUser.isVerified,
    });
  } else {
    res.status(200).json(currentUser);
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'name email isVerified');
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/user/:userId/verify', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID and update the isVerified status to true
    const user = await User.findByIdAndUpdate(userId, { isVerified: true }, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





app.post('/questions', async (req, res) => {
  try {
    const question = new Question(req.body);
    const savedQuestion = await question.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all multiple-choice questions
app.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/user-results', async (req, res) => {
  try {
    const results = await UserResults.find();
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Submit exam answers along with the user's name and selected answers
app.post('/submit-answers', authenticate,async (req, res) => {
  try {
    const {  answers } = req.body;
    

    // Create a new UserResult document
    const userResult = new UserResults({
    
      answers,
      userId:req.user._id,
    });

    // Save the user result to the database
    await userResult.save();

    res.status(201).json({ message: 'User result saved successfully' });
  } catch (error) {
    console.error('Error saving user result:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/current-user-results', authenticate, async (req, res) => {
  try {
    // Assuming you have a UserResult model
    const userResults = await UserResults.find({ userId: req.user._id });
    res.json(userResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});