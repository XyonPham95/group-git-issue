import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Col, Row, } from 'react-bootstrap/';
import NavBar from './components/NavBar'
import RenderSearchResults from './components/RenderSearchResults'
import RenderRepo from './components/RenderRepo'
import RenderIssues from './components/RenderIssues'
import ReactModal from 'react-modal';
import Pagination from "react-js-pagination";

const clientId = process.env.REACT_APP_CLIENT_ID;

function App() {
  const [issues, setIssues] = useState([])
  const [token, setToken] = useState(null);
  const [reps, setReps] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [view, setView] = useState('landing')
  const [repo, setRepo] = useState(null)



  useEffect(() => { //if we already have token in our local storage, then just use that one, if not then call the server
    const existingToken = localStorage.getItem('token');
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
  }, [])

  const fetchSearch = async (search) => {
    const res = await fetch(`https://api.github.com/search/repositories?q=${search}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/vnd.github.mercy-preview+json'
        // 'Authorization': 'token' + token
      }
    })
    const data = await res.json();
    setReps(reps.concat(data.items))
  setView("search")
  console.log(data)
}

const fetchRepo = async (fullname) => {
  const res = await fetch(`https://api.github.com/repos/${fullname}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/vnd.github.mercy-preview+json'
    }

  })
  const data = await res.json();
  setRepo(data)
  setView('repo')
}

const fetchIssues = async (fullname) => {
  const res = await fetch(`https://api.github.com/repos/${fullname}/issues`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/vnd.github.mercy-preview+json'
    }

  })
  const data = await res.json();
  setIssues(data)
  setView('issues')
}

if (!token) {
  return (
    <div>
      there is no token
      </div>
  )
}

const viewController = () => {
  if (view === 'landing') return (<div>landing</div>)
  else if (view === 'search') return (<div><RenderSearchResults reps={reps} fetchRepo={fetchRepo} /></div>)
  else if (view === 'repo') return (<RenderRepo setView={setView} repo={repo} fetchIssues={fetchIssues} />)
  else if (view === 'issues') return (<RenderIssues issues={issues} />)
}

return (
  <div>
    <NavBar fetchSearch={fetchSearch} setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
    {token}
    {viewController()}
  </div>
)}

export default App;
