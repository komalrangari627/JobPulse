import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// pages
import Home from "./components/pages/Home.jsx";
import UserLoginRegister from './components/pages/UserLoginRegister.jsx';
import UserDashboard from './components/pages/UserDashboard/UserDashboard.jsx';
import DisplayJob from './components/pages/DisplayJob.jsx';
import DisplayCompany from './components/pages/DisplayCompany.jsx';
import CompanyPage from './components/sections/companies/CompanyPage.jsx';
import ApplyPage from "./components/pages/ApplyPage.jsx";

// context
import { UserProvider } from './context/userContext.jsx';
import { MessageProvider } from './context/messageContext.jsx';
import { JobProvider } from './context/jobContext.jsx';
import { CompanyProvider } from "./context/companyContext.jsx";
import QuestionGenerator from "./components/QuestionGenerator.jsx";
import InterviewQuiz from "./components/pages/interview/InterviewQuiz";

const App = () => {
  return (
    <UserProvider>
      <MessageProvider>
        <JobProvider>
          <CompanyProvider>
            <Router>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/user-login-register' element={<UserLoginRegister />} />
                <Route path='/user-dashboard' element={<UserDashboard />} />
                <Route path="/company-detail/:companyId" element={<DisplayCompany />} />
                <Route path="/company/:companyId" element={<CompanyPage />} />
                <Route path="/job/:jobId" element={<DisplayJob />} />

                {/* Updated Apply route to include jobId */}
                <Route path="/apply/:jobId" element={<ApplyPage />} />
                <Route path="/online-interview/:jobId/quiz" element={<InterviewQuiz />} />
                    <Route path="/ai-questions" element={<QuestionGenerator />} />
              </Routes>
            </Router>
          </CompanyProvider>
        </JobProvider>
      </MessageProvider>
    </UserProvider>
  );
};

export default App;
