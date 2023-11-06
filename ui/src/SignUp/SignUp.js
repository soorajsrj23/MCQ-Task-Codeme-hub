import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:4000/signup', {
        name,
        email,
        password,
      });

      if (response.status === 200) {
        // Registration successful, you can handle it here
        navigate('/login'); // Redirect to the login page
      } else {
        // Handle registration failure here
        console.error('Registration failed.');
      }
    } catch (error) {
      // Handle any errors that occur during registration
      console.error('Error registering user:', error);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
};

export default SignUp;
