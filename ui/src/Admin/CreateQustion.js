// CreateQuestion.js
import React, { useState } from 'react';
import axios from 'axios';

function CreateQuestion() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([{ text: '', isCorrect: false }]);

  const handleOptionChange = (index) => (e) => {
    const newOptions = [...options];
    newOptions[index].text = e.target.value;
    setOptions(newOptions);
  };

  const handleCorrectAnswerChange = (index) => (e) => {
    const newOptions = [...options];
    newOptions[index].isCorrect = e.target.checked;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { text: '', isCorrect: false }]);
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = async () => {
    const newQuestion = { text: question, options };
    try {
      await axios.post('http://localhost:4000/questions', newQuestion);
      // Handle success or redirection to another page
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter the question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      {options.map((option, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder={`Option ${index + 1}`}
            value={option.text}
            onChange={handleOptionChange(index)}
          />
          <label>
            Correct Answer
            <input
              type="checkbox"
              checked={option.isCorrect}
              onChange={handleCorrectAnswerChange(index)}
            />
          </label>
          <button onClick={() => removeOption(index)}>Remove Option</button>
        </div>
      ))}
      <button onClick={addOption}>Add Option</button>
      <button onClick={handleSubmit}>Submit Question</button>
    </div>
  );
}

export default CreateQuestion;
