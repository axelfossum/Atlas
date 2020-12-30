import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/navbar.component";
import ActiveTasksList from "./components/active-tasks-list.component";
import ArchivedTasksList from "./components/archived-tasks-list.component";
import About from "./components/about.component";
import Login from "./components/login.component";
import Register from "./components/register.component";
import UserContext from './context/UserContext';
import axios from 'axios';

function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined
  }); 

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem('auth-token');
      if(token === null) {
        localStorage.setItem('auth-token', '');
        token = '';
      }

      const tokenRes = await axios.post('http://localhost:5000/user/tokenIsValid', null,
      { headers: { 'x-auth-token': token } });

      // Get user data and store in user context
      if(tokenRes.data){
        const userRes = await axios.get('http://localhost:5000/user/getuser/', { 
          headers: {'x-auth-token': token} 
        });
        setUserData({
          token,
          user: userRes.data
        });
      }
    }

    checkLoggedIn();
  }, []);

  // React Context allows us to essentially create states that can be shared with other components.
  // We use it to store user logged in state and basic user info (NOT PASSWORD).
  return (
    <Router>
      <UserContext.Provider value={{userData, setUserData}}>
        <Navbar />
        <Route path="/" exact component={ActiveTasksList} />
        <Route path="/about" component={About} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </UserContext.Provider>
    </Router>
  );
}

export default App;
