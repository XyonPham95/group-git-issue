import React, {useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Moment from 'react-moment';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import NewIssueButton from './NewIssueButton';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'

export default function RenderSingleIssue(props) {
    let singleIssue = props.singleIssue;
    let comments = props.comments;
    const [newComment, setNewComment] = useState('')
   

    const newIssue = (title, content) => {
        props.postNewIssue(props.fullName,title,content);
        setTimeout(() => props.fetchIssues(props.fullName), 3000);
        props.closeModal();
    }

    const sendReaction = async (reaction) => {
        console.log("reaction is:", reaction);
        const content = { "content": `${reaction}`};
        const url = `https://api.github.com/repos/${props.fullName}/issues/${props.issueNumber}/reactions`;
        const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `token ${props.token}`,
            "Accept": " application/vnd.github.squirrel-girl-preview+json"
        },
        body: JSON.stringify(content)
        });

        console.log('response:',response);
    }

    

    const renderComment = () => {
        if(!singleIssue.comments){
            return <div>There is no comment here.</div>
        } else {
            return comments.map((comment) => 
                <Card key={comment.id} className="container">
                <Card.Header className="d-flex justify-content-between">
                    <div className="left">{comment.user.login} commented at <Moment fromNow>{comment.created_at}</Moment></div>
                    <div className="right">
                        <DropdownButton id="dropdown-basic-button" key={comment.id} title="Reactions">
                        <Dropdown.Item  onClick={()=>sendReaction("+1")}><img style={{height: "20px"}} src="https://github.githubassets.com/images/icons/emoji/unicode/1f44d.png"/></Dropdown.Item>
                        <Dropdown.Item onClick={()=>sendReaction("-1")}><img style={{height: "20px"}} src="https://github.githubassets.com/images/icons/emoji/unicode/1f44e.png"/></Dropdown.Item>
                        <Dropdown.Item onClick={()=>sendReaction("laugh")}><img style={{height: "20px"}} src="https://github.githubassets.com/images/icons/emoji/unicode/1f604.png"/></Dropdown.Item>
                        <Dropdown.Item onClick={()=>sendReaction("confused")}><img style={{height: "20px"}} src="https://github.githubassets.com/images/icons/emoji/unicode/1f615.png"/></Dropdown.Item>
                        <Dropdown.Item onClick={()=>sendReaction("heart")}><img style={{height: "20px"}} src="https://github.githubassets.com/images/icons/emoji/unicode/2764.png"/></Dropdown.Item>
                        <Dropdown.Item onClick={()=>sendReaction("hooray")}><img style={{height: "20px"}} src="https://github.githubassets.com/images/icons/emoji/unicode/1f389.png"/></Dropdown.Item>
                        <Dropdown.Item onClick={()=>sendReaction("rocket")}><img style={{height: "20px"}} src="https://github.githubassets.com/images/icons/emoji/unicode/1f680.png"/></Dropdown.Item>
                        <Dropdown.Item onClick={()=>sendReaction("eyes")}><img style={{height: "20px"}} src="https://github.githubassets.com/images/icons/emoji/unicode/1f440.png"/></Dropdown.Item>
                        </DropdownButton>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Card.Text>
                    {comment.body}
                    </Card.Text>
                </Card.Body>
                </Card>
                )     
        }
    }

    return (
        <div className="container">
            <div className="top d-flex justify-content-between" style={{borderBottom: "1px solid lightgrey"}}>
                <div className="left">
                    <h2>{singleIssue.title} <span style={{color: "lightgrey"}}>#{singleIssue.number}</span></h2>
                </div>
                <div className="right">
                <NewIssueButton onClick={()=>props.openIssue()} newIssue={newIssue} closeModal={props.closeModal} isOpen={props.isModalOpen}/>
                </div>
            </div>
            <div className="bottom">
                <Card>
                    <Card.Header className="d-flex justify-content-between">
                        <div className="left">{singleIssue.user.login} commented at <Moment fromNow>{singleIssue.created_at}</Moment></div>
                        <div className="right">
                            <DropdownButton id="dropdown-basic-button" key={singleIssue.id} title="Reactions">
                            <Dropdown.Item  onClick={()=>sendReaction("+1")}><img style={{height: "20px"}} src="https://github.githubassets.com/images/icons/emoji/unicode/1f44d.png"/></Dropdown.Item>
                            <Dropdown.Item onClick={()=>sendReaction("-1")}><img style={{height: "20px"}} src="https://github.githubassets.com/images/icons/emoji/unicode/1f44e.png"/></Dropdown.Item>
                            <Dropdown.Item onClick={()=>sendReaction("laugh")}><img style={{height: "20px"}} src="https://github.githubassets.com/images/icons/emoji/unicode/1f604.png"/></Dropdown.Item>
                            <Dropdown.Item onClick={()=>sendReaction("confused")}><img style={{height: "20px"}} src="https://github.githubassets.com/images/icons/emoji/unicode/1f615.png"/></Dropdown.Item>
                            <Dropdown.Item onClick={()=>sendReaction("heart")}><img style={{height: "20px"}} src="https://github.githubassets.com/images/icons/emoji/unicode/2764.png"/></Dropdown.Item>
                            <Dropdown.Item onClick={()=>sendReaction("hooray")}><img style={{height: "20px"}} src="https://github.githubassets.com/images/icons/emoji/unicode/1f389.png"/></Dropdown.Item>
                            <Dropdown.Item onClick={()=>sendReaction("rocket")}><img style={{height: "20px"}} src="https://github.githubassets.com/images/icons/emoji/unicode/1f680.png"/></Dropdown.Item>
                            <Dropdown.Item onClick={()=>sendReaction("eyes")}><img style={{height: "20px"}} src="https://github.githubassets.com/images/icons/emoji/unicode/1f440.png"/></Dropdown.Item>
                            </DropdownButton>
                        </div>
                        </Card.Header>
                    <Card.Body>
                        <Card.Text>
                        {singleIssue.body}
                        </Card.Text>
                    </Card.Body>
                </Card>

                {/* render Comments */}
                {renderComment()}
                {/* add new comment */}
                <Form className="container">   
                    <Form.Group controlId="comment-body">
                        <Form.Label>Write</Form.Label>
                        <Form.Control as="textarea" rows="10" onChange={(e)=>setNewComment(e.target.value)} placeholder="Leave a comment" />
                    </Form.Group>
                    <Button className="float-right" variant="success" type="submit" onClick={()=>props.submitNewComment(props.fullName,newComment)}>
                        Comment
                    </Button>
                </Form>

            </div>
        </div>
    )
}
