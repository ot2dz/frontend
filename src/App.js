import React from 'react';
import { Route, Routes } from 'react-router-dom'; // تعديل هنا
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Drivers from './pages/Drivers';
import Rides from './pages/Rides';
import 'bootstrap/dist/css/bootstrap.min.css';
const App = () => {
  return (
    <div>
      <Routes> {/* تعديل هنا */}
        <Route path="/" element={<Dashboard />} /> {/* تعديل هنا */}
        <Route path="/users" element={<Users />} /> {/* تعديل هنا */}
        <Route path="/drivers" element={<Drivers />} /> {/* تعديل هنا */}
        <Route path="/rides" element={<Rides />} /> {/* تعديل هنا */}
      </Routes>
    </div>
  );
};

export default App;

