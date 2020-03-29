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
    const [comment, setComment] = useState('')

    return (
        <div>
            <div className="top d-flex justify-content-between" style={{borderBottom: "1px solid lightgrey"}}>
                <div className="left">
                    <h2>{singleIssue.title} <span style={{color: "lightgrey"}}>#{singleIssue.number}</span></h2>
                </div>
                <div className="right">
                    <NewIssueButton onClick={()=>props.openIssue()} closeModal={props.closeModal} isOpen={props.isModalOpen}/>
                </div>
            </div>
            <div className="bottom">
                <Card>
                    <Card.Header className="d-flex justify-content-between">
                        <div className="left">{singleIssue.user.login} commented at <Moment fromNow>{singleIssue.created_at}</Moment></div>
                        <div className="right">
                            <DropdownButton id="dropdown-basic-button" key={singleIssue.id} title="Reactions">
                            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                            </DropdownButton>
                        </div>
                        </Card.Header>
                    <Card.Body>
                        <Card.Text>
                        {singleIssue.body}
                        </Card.Text>
                    </Card.Body>
                </Card>

                <Form >   
                    <Form.Group controlId="comment-body">
                        <Form.Label>Write</Form.Label>
                        <Form.Control as="textarea" rows="10" onChange={(e)=>setComment(e.target.value)} placeholder="Leave a comment" />
                    </Form.Group>
                    <Button className="float-right" variant="success" type="submit" onClick={()=>props.newComment(props.fullName,comment)}>
                        Comment
                    </Button>
                </Form>

            </div>
        </div>
    )
}
