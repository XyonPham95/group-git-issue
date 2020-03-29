import React, {useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Moment from 'react-moment';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'


export default function RenderComments(props) {
    let comments = props.comments;
    const [comment, setComment] = useState('')

    return (
        <div>
            <div className="top d-flex justify-content-between" style={{borderBottom: "1px solid lightgrey"}}>
                <div className="left">
                    <h2>{comments.title} <span style={{color: "lightgrey"}}>#{comments.number}</span></h2>
                </div>
            </div>
            <div className="bottom">
                <Card>
                    <Card.Header className="d-flex justify-content-between">
                        <div className="left">{comments.user.login} commented at <Moment fromNow>{comments.created_at}</Moment>
                        </div>
                        </Card.Header>
                    <Card.Body>
                        <Card.Text>
                        {comments.body}
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