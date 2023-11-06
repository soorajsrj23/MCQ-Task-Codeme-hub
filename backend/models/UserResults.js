const mongoose = require('mongoose');

const userResultSchema = new mongoose.Schema({
  
  userId: {
    type: String,
    required: true,
  },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId, // You can store the question ID here
        ref: 'Question', // Reference to the Question model
      },
      isCorrect: {
        type: Boolean,
        required: true,
      },
    },
  ],
});

const UserResult = mongoose.model('UserResult', userResultSchema);

module.exports = UserResult;
