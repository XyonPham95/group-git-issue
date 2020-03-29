import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Col, Row, } from 'react-bootstrap/';
import NavBar from './components/NavBar'
import RenderSearchResults from './components/RenderSearchResults'
import RenderRepo from './components/RenderRepo'
import RenderIssues from './components/RenderIssues'
import RenderSingleIssue from './components/RenderSingleIssue'
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
  const [fullName, setFullName] = useState('')
  const [singleIssue, setSingleIssue] = useState({})
  let [isModalOpen, setIsModalOpen] = useState(false)
  const [issueNumber, setIssueNumber] = useState(0)
  

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
  console.log("search result:",data)
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
  console.log('repo fetched:',data)
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
  setView('issues');
  setFullName(fullname);
  console.log('issues:', data)
}

const fetchSingleIssue = async (fullname, issueNumber) => {
  setIssueNumber(issueNumber);
  const res = await fetch(`https://api.github.com/repos/${fullname}/issues/${issueNumber}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/vnd.github.mercy-preview+json',
      'Accept': 'application/vnd.github.squirrel-girl-preview'
    }
  })
  const data = await res.json();
  console.log('single issue',data)
  setSingleIssue(data);
  setView('singleIssue');
}

const postNewIssue = async (fullname, title, content) => {
  const issue = { "title": title, "body": content };
  console.log('app.js page:',fullname,title,content,token )
  const url = `https://api.github.com/repos/${fullname}/issues`;
  const response = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization": `token ${token}`
  },
  body: JSON.stringify(issue)
});

  console.log('response:',response)
  fetchIssues(fullname);
}

const newComment = async (fullname, content) => {
  const comment = { "body": content };
  console.log('app.js page:',fullname,content,token )
  const url = `https://api.github.com/repos/${fullname}/issues/${issueNumber}/comments`;
  const response = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization": `token ${token}`
  },
  body: JSON.stringify(comment)
});

  console.log('response:',response)
  fetchSingleIssue(fullname,issueNumber);
  setView('singleIssue');
}



if (!token) {
  return (
    <div>
      there is no token
      </div>
  )
}

const openIssue = () => {
  setIsModalOpen(true);
}

const closeModal = () => {
  setIsModalOpen(false);
}

const viewController = () => {
  if (view === 'landing') return (<div>landing</div>)
  else if (view === 'search') return (<div><RenderSearchResults reps={reps} fetchRepo={fetchRepo} fetchIssues={fetchIssues} /></div>)
  else if (view === 'repo') return (<RenderRepo setView={setView} repo={repo} fetchIssues={fetchIssues} />)
  else if (view === 'issues') return (<RenderIssues fullName={fullName} issues={issues} fetchSingleIssue={fetchSingleIssue} isModalOpen={isModalOpen} openIssue={openIssue}  closeModal={closeModal} postNewIssue={postNewIssue}/>)
  else if (view === "singleIssue") return (<RenderSingleIssue fullName={fullName} singleIssue={singleIssue} openIssue={openIssue} isModalOpen={isModalOpen} closeModal={closeModal} postNewIssue={postNewIssue} newComment={newComment}/>)
}

return (
  <div>
    <NavBar fetchSearch={fetchSearch} setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
    {viewController()}
  </div>
)}

export default App;
