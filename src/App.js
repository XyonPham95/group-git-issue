import React, { useState, useEffect } from 'react';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar'
import RenderSearchResults from './components/RenderSearchResults'
import RenderRepo from './components/RenderRepo'
import RenderIssues from './components/RenderIssues'
import webdesign from './webdesign.png'


const clientId = process.env.REACT_APP_CLIENT_ID;

function App() {
  const [issues, setIssues] = useState([])
  const [token, setToken] = useState(null);
  const [reps, setReps] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [view, setView] = useState('landing')
  const [repo, setRepo] = useState([])
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [searchTotalCount, setSearchTotalCount] = useState(0)
  const [fullName, setFullName] = useState('')



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
    
    const res = await fetch(`https://api.github.com/search/repositories?q=${search}&page=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/vnd.github.mercy-preview+json'
        // 'Authorization': 'token' + token
      }
    })
    const data = await res.json();
    setSearchTotalCount(search);
    setReps(reps.concat(data.items))
    setSearchTotalCount(data.total_count);
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
  console.log(data)
  setTotalCount(data.open_issues_count)

  // setView('repo') no more repo view state, however there is still a fetchrepo function in use (see line 88)
}

const fetchIssues = async (fullname) => {
  const res = await fetch(`https://api.github.com/repos/${fullname}/issues`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/vnd.github.mercy-preview+json'
    }

  })
  console.log('result',res)
  setFullName(fullname);
  const data = await res.json();
  console.log(data)
  setIssues(data)
  setView('issues')
  fetchRepo(fullname);
 
}

const handlePageChange = async (page) => {
  setPage(page)
  const res = await fetch(`https://api.github.com/repos/${fullName}/issues?page=${page}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/vnd.github.mercy-preview+json'
    }

  })
  console.log(res)
  const data = await res.json();
  console.log(data)
  setIssues(data)
}

const handleSearchPageChange = async (page) => {
  setPage(page)
  const res = await fetch(`https://api.github.com/search/repositories?q=${searchTerm}&page=${page}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/vnd.github.mercy-preview+json'
    }

  })
  console.log(res)
  const data = await res.json();
  console.log(data)
  setReps(data.items)
  //setReps(reps.concat(data.items));
  setView("search")
}
if (!token) {
  return (
    <div>
      there is no token
      </div>
  )
}

const viewController = () => {
  if (view === 'landing') return (<div className="img-home"><img src={webdesign} alt="star" style={{width: '50%'}}/></div>)
  else if (view === 'search') return (<div><RenderSearchResults reps={reps} fetchRepo={fetchRepo} fetchIssues={fetchIssues} issues={issues} page={page} handleSearchPageChange={handleSearchPageChange} searchTotalCount={searchTotalCount}/></div>)
  // else if (view === 'repo') return (<div><RenderRepo setView={setView} repo={repo} fetchIssues={fetchIssues} issues={issues}/> </div>)
  else if (view === 'issues') return (<RenderIssues issues={issues} repo={repo} searchTerm={searchTerm} page={page} handlePageChange={handlePageChange} totalCount={totalCount} repo={repo}/>)
}

return (
  <div>
    <NavBar fetchSearch={fetchSearch} setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
    {viewController()}
  </div>
)}

export default App;
