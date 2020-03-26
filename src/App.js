import React, {useState,useEffect} from 'react';
// import logo from './logo.svg';
import './App.css';

const clientId = process.env.REACT_APP_CLIENT_ID;


function App() {
  const [token,setToken]= useState(null);
  useEffect(()=>{
  const existingToken = sessionStorage.getItem('token');
  const accessToken = (window.location.search.split("=")[0] === "?access_token") ? window.location.search.split("=")[1] : null;

  if (!accessToken && !existingToken) {
    window.location.replace(`https://github.com/login/oauth/authorize?scope=user:email,repo&client_id=${clientId}`)
  }

  if (accessToken) {
    console.log(`New accessToken: ${accessToken}`);

    localStorage.setItem("token", accessToken);
    setToken(accessToken)
  }

  if (existingToken) {
    setToken(existingToken)
  }
},[])

  return (
    <div></div>
  );
}

export default App;
