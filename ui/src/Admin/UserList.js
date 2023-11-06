import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch the list of users and their isVerified status
    axios.get('http://localhost:4000/users')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleVerify = (userId) => {
    // Send a request to change the isVerified status to true for a specific user
    axios.put(`http://localhost:4000/user/${userId}/verify`)
      .then((response) => {
        // Update the users array to reflect the change
        const updatedUsers = users.map((user) => {
          if (user._id === userId) {
            return { ...user, isVerified: true };
          }
          return user;
        });
        setUsers(updatedUsers);
      })
      .catch((error) => {
        console.error('Error verifying user:', error);
      });
  };

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.name} ({user.email}) - Is Verified: {user.isVerified ? 'Yes' : 'No'}
            {!user.isVerified && (
              <button onClick={() => handleVerify(user._id)}>Verify</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
