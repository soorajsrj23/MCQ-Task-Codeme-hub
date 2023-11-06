import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TakeExam = () => {
 
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    // Fetch questions from the server when the component mounts
    axios.get('http://localhost:4000/questions')
      .then((response) => {
        setQuestions(response.data);
        const initialAnswers = {};
        response.data.forEach((question) => {
          initialAnswers[question._id] = '';
        });
        setAnswers(initialAnswers);
      })
      .catch((error) => {
        console.error('Error fetching questions:', error);
      });
  }, []);

  const handleAnswerChange = (questionId, optionId) => {
    const newAnswers = { ...answers };
    newAnswers[questionId] = optionId;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    // Prepare an array to store the correctness of each answer
    const userAnswers = [];

    // Loop through the questions and compare selected answers with correct answers
    questions.forEach((question) => {
      const selectedAnswerId = answers[question._id];
      const isCorrect = question.options.some((option) => option._id === selectedAnswerId && option.isCorrect);

      // Add the correctness value to the array
      userAnswers.push({ questionId: question._id, isCorrect });
    });

    // Prepare data for submission
    const submissionData = {
    
      answers: userAnswers, // Store the correctness for each question
    };

    axios.post('http://localhost:4000/submit-answers', submissionData, {
      headers: {
        Authorization: localStorage.getItem('token'), // Include the authorization token in the POST request
      },
    }).then((response) => {
        console.log('Submission response:', response.data);
      })
      .catch((error) => {
        console.error('Error submitting answers:', error);
      });
  };

  return (
    <div>
      <h1>Take the Exam</h1>
    
      <form>
        {questions.map((question) => (
          <div key={question._id}>
            <h3>{question.text}</h3>
            {question.options.map((option) => (
              <label key={option._id}>
                <input
                  type="radio"
                  name={question._id}
                  value={option._id}
                  checked={answers[question._id] === option._id}
                  onChange={() => handleAnswerChange(question._id, option._id)}
                />
                {option.text}
              </label>
            ))}
          </div>
        ))}
      </form>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default TakeExam;
