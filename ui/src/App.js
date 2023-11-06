import React from 'react';
import SignUp from './SignUp/SignUp';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login/Login';

import PageNotFound from './Route/PageNotFound'
import CreateQuestion from './Admin/CreateQustion';
import TakeExam from './Student/TakeTest';
import ExamResults from './Student/ExamResults';
import UserList from './Admin/UserList';
import VerifyUser from './CustomHook/VerifyUser';
import NotVerified from './CustomHook/NotVerified';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<SignUp />} />
          <Route path="login" element={<Login />} />
          <Route path="create" element={<CreateQuestion />} />
          <Route path="/not-verified" element={<NotVerified />} />
          <Route path="/*" element={<PageNotFound />} />
          <Route path="/result" element={<VerifyUser><ExamResults /></VerifyUser>} />
          <Route path="/all-user" element={<UserList />} />
          <Route path="test" element={<VerifyUser><TakeExam /></VerifyUser>} />
           
        </Routes>
      </Router>
    </div>
  );
}

export default App;
