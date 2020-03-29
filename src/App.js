import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./components/NavBar";
import RenderSearchResults from "./components/RenderSearchResults";
import RenderRepo from "./components/RenderRepo";
import RenderIssues from "./components/RenderIssues";
import webdesign from "./webdesign.png";
import RenderSingleIssue from "./components/RenderSingleIssue";
import ReactModal from "react-modal";
import Pagination from "react-js-pagination";

const clientId = process.env.REACT_APP_CLIENT_ID;

function App() {
  const [issues, setIssues] = useState([]);
  const [token, setToken] = useState(null);
  const [reps, setReps] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("landing");
  const [repo, setRepo] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTotalCount, setSearchTotalCount] = useState(0);
  const [fullName, setFullName] = useState("");
  const [singleIssue, setSingleIssue] = useState({});
  const [comments, setComments] = useState([]);
  let [isModalOpen, setIsModalOpen] = useState(false);
  const [issueNumber, setIssueNumber] = useState(0);

  useEffect(() => { //if we already have token in our local storage, then just use that one, if not then call the server
    const existingToken = localStorage.getItem('token');
    const accessToken = (window.location.search.split("=")[0] === "?access_token") ? window.location.search.split("=")[1] : null;

    if (!accessToken && !existingToken) {
      window.location.replace(`https://github.com/login/oauth/authorize?scope=user:email,repo&client_id=${clientId}`)
    }

    if (accessToken) {
      if(accessToken.includes("&scope")){
        let splitToken = accessToken.split("&")
        console.log(`New accessToken: ${splitToken[0]}`);
        localStorage.setItem("token",splitToken[0])
        setToken(splitToken[0])
      }
      
    }

    if (existingToken) {
      setToken(existingToken)
    }
  }, [])

  const fetchSearch = async search => {
    const res = await fetch(
      `https://api.github.com/search/repositories?q=${search}&page=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/vnd.github.mercy-preview+json"
          // 'Authorization': 'token' + token
        }
      }
    );
    const data = await res.json();
    setSearchTotalCount(search);
    setReps(reps.concat(data.items));
    setSearchTotalCount(data.total_count);
    setView("search");
    console.log(data);
  };

  const fetchRepo = async fullname => {
    const res = await fetch(`https://api.github.com/repos/${fullname}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/vnd.github.mercy-preview+json"
      }
    });
    const data = await res.json();
    setRepo(data);
    console.log(data);
    setTotalCount(data.open_issues_count);

    // setView('repo') no more repo view state, however there is still a fetchrepo function in use (see line 88)
  };

  const fetchIssues = async fullname => {
    const res = await fetch(`https://api.github.com/repos/${fullname}/issues`, {
      method: "GET",
      headers: {
        "Content-Type": "application/vnd.github.mercy-preview+json"
      }
    });
    console.log("result", res);
    setFullName(fullname);
    const data = await res.json();
    console.log(data);
    setIssues(data);
    setView("issues");
    fetchRepo(fullname);
  };

  const fetchSingleIssue = async (fullname, issueNumber) => {
    setIssueNumber(issueNumber);
    const res = await fetch(
      `https://api.github.com/repos/${fullname}/issues/${issueNumber}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/vnd.github.mercy-preview+json",
          Accept: "application/vnd.github.squirrel-girl-preview"
        }
      }
    );
    const data = await res.json();
    console.log("single issue", data);
    setSingleIssue(data);

    if (data.comments > 0) {
      const resComment = await fetch(
        `https://api.github.com/repos/${fullname}/issues/${issueNumber}/comments`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/vnd.github.mercy-preview+json",
            Accept: "application/vnd.github.squirrel-girl-preview"
          }
        }
      );
      const dataComment = await resComment.json();
      console.log("display comments", dataComment);
      setComments(dataComment);
    }
    setView("singleIssue");
  };

  const postNewIssue = async (fullname, title, content) => {
    const issue = { title: title, body: content };
    console.log("app.js page:", fullname, title, content, token);
    const url = `https://api.github.com/repos/${fullname}/issues`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `token ${token}`
      },
      body: JSON.stringify(issue)
    });
    console.log("response:", response);

    //fetch Issues again
    const res = await fetch(`https://api.github.com/repos/${fullname}/issues`, {
      method: "GET",
      headers: {
        "Content-Type": "application/vnd.github.mercy-preview+json"
      }
    });
    const data = await res.json();
    setIssues(data);
    closeModal();
  };

  const submitNewComment = async (fullname, content) => {
    const newComment = { "body": content };
    console.log('app.js page:',fullname,content,token )
    const url = `https://api.github.com/repos/${fullname}/issues/${issueNumber}/comments`;
    const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `token ${token}`
    },
    body: JSON.stringify(newComment)
  });
    console.log('response:',response)
  
    const resComment = await fetch(`https://api.github.com/repos/${fullname}/issues/${issueNumber}/comments`, {
      method: "GET",
      headers: {
      'Content-Type': 'application/vnd.github.mercy-preview+json',
      'Accept': 'application/vnd.github.squirrel-girl-preview'
      }
    })
    const dataComment = await resComment.json();
    console.log('display comments',dataComment)
    setComments(dataComment);
    setTimeout(() => fetchSingleIssue(fullName, issueNumber), 3000);
    closeModal();
  }

  const handlePageChange = async page => {
    setPage(page);
    const res = await fetch(
      `https://api.github.com/repos/${fullName}/issues?page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/vnd.github.mercy-preview+json"
        }
      }
    );
    console.log(res);
    const data = await res.json();
    console.log(data);
    setIssues(data);
  };

  const handleSearchPageChange = async page => {
    setPage(page);
    const res = await fetch(
      `https://api.github.com/search/repositories?q=${searchTerm}&page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/vnd.github.mercy-preview+json"
        }
      }
    );
    console.log(res);
    const data = await res.json();
    console.log(data);
    setReps(data.items);
    //setReps(reps.concat(data.items));
    setView("search");
  };
  if (!token) {
    return <div>there is no token</div>;
  }

  const openIssue = () => {
    setIsModalOpen(true);
  }
  
  const closeModal = () => {
    setIsModalOpen(false);
  }

  const viewController = () => {
    if (view === "landing")
      return (
        <div className="img-home">
          <img src={webdesign} alt="star" style={{ width: "50%" }} />
        </div>
      );
    else if (view === "search")
      return (
        <div>
          <RenderSearchResults
            reps={reps}
            fetchRepo={fetchRepo}
            fetchIssues={fetchIssues}
            issues={issues}
            page={page}
            handleSearchPageChange={handleSearchPageChange}
            searchTotalCount={searchTotalCount}
          />
        </div>
      );
    else if (view === "repo")
      return (
        <RenderRepo 
        setView={setView} 
        repo={repo} 
        fetchIssues={fetchIssues} />
      );
    else if (view === "issues")
      return (
        <RenderIssues
          issues={issues}
          repo={repo}
          searchTerm={searchTerm}
          page={page}
          handlePageChange={handlePageChange}
          totalCount={totalCount}
          fullName={fullName}
          fetchSingleIssue={fetchSingleIssue}
          isModalOpen={isModalOpen}
          openIssue={openIssue}
          closeModal={closeModal}
          postNewIssue={postNewIssue}
          fetchIssues={fetchIssues}
        />
      );
    else if (view === "singleIssue")
      return (
        <RenderSingleIssue
          fullName={fullName}
          singleIssue={singleIssue}
          openIssue={openIssue}
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          fetchIssues={fetchIssues}
          postNewIssue={postNewIssue}
          submitNewComment={submitNewComment}
          issueNumber={issueNumber}
          token={token}
          setView={setView}
          comments={comments}
        />
      );
  };

  return (
    <div>
      <NavBar
        fetchSearch={fetchSearch}
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
      />
      {viewController()}
    </div>
  );
}

export default App;
