import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {Home} from './view/home';
import { User } from './view/user';
import './app.css';


function App() {
  return (
    <div className='app'>
      <Routes>
        <Route path='/login' element={<User/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/' element={<Home/>}/>
      </Routes>
    </div>
  );
}

export default App;
