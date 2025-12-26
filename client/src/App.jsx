import React from 'react'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// pages
import Home from "./components/pages/Home.jsx"
import UserLoginRegister from './components/pages/UserLoginRegister.jsx'

// context
import { UserProvider } from './context/userContext.jsx'
import { MessageProvider } from './context/messageContext.jsx'
import Message from './components/sections/actions/Message.jsx'
import UserDashboard from './components/pages/UserDashboard/UserDashboard.jsx'
import { JobProvider } from './context/jobContext.jsx'
import DisplayJob from './components/pages/DisplayJob.jsx'

import { CompanyProvider } from "./context/companyContext.jsx";
import CompanyPage from './components/sections/companies/CompanyPage.jsx'
import DisplayCompany from './components/pages/DisplayCompany.jsx'

import ApplyPage from "./components/pages/ApplyPage";

const App = () => {

  return (
    <>
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
                  <Route path="/apply/:jobId" element={<ApplyPage />} />
                </Routes>
              </Router>
            </CompanyProvider>
          </JobProvider>
        </MessageProvider>
      </UserProvider>
    </>
  )
}

export default App
