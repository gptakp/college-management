import { useEffect } from 'react';
import './App.css';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './Components/ProtectedRoute';
import store from './store';
import Branches from './Components/Branches/Branches';
import Branch from './Components/Branches/Branch';
import Lecturers from './Components/Lecturers/Lecturers';
import Students from './Components/Students/Students';
import Lecturer from './Components/Lecturers/Lecturer';
// import Student from './Components/Students/Student';
import Classes from './Components/Classes/Classes';
import Class from './Components/Classes/Class';
import Enrollments from './Components/Enrollments/Enrollments';
import EnrollmentDetails from './Components/Enrollments/EnrollmentDetails';
import { ConfigProvider } from 'antd';
import MainLayout from './Components/Home/MainLayout';
import VisionAndMission from './Components/Home/VisionAndMission';
import About from './Components/Home/About';
import Library from './Components/Library/Library';
import Fees from './Components/Fees/Fees';
import Login from './Components/Login';
import Auditorium from './Components/Auditorium/Auditorium';
import Student from './Components/Students/Student';
import Home from './Components/Home/Home';
import Welcome from './Components/Home/Welcome';
import React from 'react';

function App() {
  useEffect(() => {
    if (window.location.pathname === "/") {
      window.location.replace("/home")
    }
  }, [window.location.pathname])

  return <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#ff6f06',
      },
    }}
  >
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/welcome' element={<Welcome />} />
          <Route path='/login' element={<Login />} />
          <Route path='/about' element={<ProtectedRoute><About /></ProtectedRoute>} />
          <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path='/vision-and-mission' element={<ProtectedRoute><VisionAndMission /></ProtectedRoute>} />
          <Route path='/branches' element={<ProtectedRoute><Branches /></ProtectedRoute>} />
          <Route path='/branches/:branchesId/:tab?' element={<ProtectedRoute><Branch /></ProtectedRoute>} />
          <Route path='/lecturers' element={<ProtectedRoute><Lecturers /></ProtectedRoute>} />
          <Route path='/lecturers/:lecturerId/:currTab?' element={<ProtectedRoute><Lecturer /></ProtectedRoute>} />
          <Route path='/students' element={<ProtectedRoute><Students /></ProtectedRoute>} />
          <Route path='/students/:studentId/:currTab?' element={<ProtectedRoute><Student /></ProtectedRoute>} />
          <Route path='/classes' element={<ProtectedRoute><Classes /></ProtectedRoute>} />
          <Route path='/classes/:classId/:currTab?' element={<ProtectedRoute><Class /></ProtectedRoute>} />
          <Route path='/enrollments' element={<ProtectedRoute><Enrollments /></ProtectedRoute>} />
          <Route path='/enrollments/:enrollmentId' element={<ProtectedRoute><EnrollmentDetails /></ProtectedRoute>} />
          <Route path='/library/:currTab?/:id?' element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path='/fees/:currTab?/:id?' element={<ProtectedRoute><Fees /></ProtectedRoute>} />
          <Route path='/auditorium' element={<ProtectedRoute><Auditorium /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </ConfigProvider>
}

export default App;
