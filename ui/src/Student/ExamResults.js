import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewResults = () => {
  const [userResults, setUserResults] = useState([]);

  useEffect(() => {
    // Fetch user results from the server when the component mounts
    axios.get('http://localhost:4000/current-user-results', {
  headers: {
    Authorization: localStorage.getItem('token'),
  },
})
  .then((response) => {
        setUserResults(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user results:', error);
      });
  }, []);

  return (
    <div>
      <h2>User Results</h2>
      <table>
        <thead>
          <tr>
            <th>User </th>
            <th>Total Questions</th>
            <th>Correct Answers</th>
          </tr>
        </thead>
        <tbody>
          {userResults.map((result) => (
            <tr key={result._id}>
              <td>{result.userName}</td>
              <td>{result.answers.length}</td>
              <td>{result.answers.filter((answer) => answer.isCorrect).length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewResults;
