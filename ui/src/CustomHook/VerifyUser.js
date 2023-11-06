import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerifyUser = ({children }) => {
  const [isVerified, setIsVerified] = useState('');
  const history = useNavigate();

    useEffect(() => {
      // Make an HTTP GET request to fetch the isVerified field
      const fetchIsVerified = async () => {
        const response = await axios.get(`http://localhost:4000/current-user-verification`, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        setIsVerified(response.data.isVerified);
      };
  
      fetchIsVerified();
    }, []);
  
    useEffect(() => {
      if (isVerified === true) {
        // User is verified, navigate to the test page
        history('/test');
      } else if (isVerified !== '') {
        alert('Not verified');
        history('/not-verified');
      }
    }, [isVerified]);
  
    return <>{children}</>;
  };
  
  export default VerifyUser;

