import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Col, Row, Button} from 'react-bootstrap/';
import moment from 'moment'
import Label from './Label'
import Pagination from "react-js-pagination";
import ReactModal from 'react-modal';
import NewIssueButton from './NewIssueButton'

export default function RenderIssues(props) {
    const newIssue = (title, content) => {
        props.postNewIssue(props.fullName,title,content);
        setTimeout(() => props.fetchIssues(props.fullName), 3000);
        console.log('fullname, title, content', props.fullName, title, content);
        props.closeModal();
    }


    const renderIssues = () => {
        if(props.repo){
            return props.issues.map(item =>
                <Card className="border-left-0 !important, border-right-0 pt-3 pb-3">
                    <Row>
                        <Col sm={10}>
                            <Card.Title key={item.id} onClick={()=>props.fetchSingleIssue(props.fullName, item.number)}><span style={{ fontWeight: 'bolder' }}>#{item.number}</span> {item.title}
                                <Label labels={item.labels} />
                            </Card.Title>
                            <Card.Subtitle className="mb-2 text-muted"><span style={{ fontStyle: 'italic' }}>Opened {moment(item.created_at).startOf('day').fromNow()}</span> by <span style={{ fontWeight: 'bold', color: 'black' }}>@{item.user.login}</span></Card.Subtitle>
                            <Card.Text>{item.body}</Card.Text>
                        </Col>
                        <Col sm={2}>
                            <Card.Text><img style={{ width: 100, borderRadius: 100 }} src={`${item.user.avatar_url}`} /></Card.Text>
                        </Col>
                    </Row>
                </Card >
            )
        } 
    }
    return (
        <div>
        <div id="grad" class="jumbotron jumbotron-fluid">
            <div class="container text-center">
                <h3 >Learn Git and Github without any code!</h3>
                <p class="lead">Using the Hello World guide, you'll start a branch, write comments, and open a pull request.</p>
                <a href="https://guides.github.com/activities/hello-world/"><Button variant='success'>Read the guide </Button></a>
            </div>
        </div>
        <div className="container">
            <Card className='p3 mb-3'>
                <Card.Body style={{paddingLeft: 5 +'rem', paddingRight: 5+'rem'}}className='text-center'>
                    <h5 style={{ fontWeight: 'bold' }}>👋Want to contribute to {props.repo.full_name}?</h5>
                    <p>If you have a bug or an idea, read the contributing guidelines before opening an issue.<br></br>
                    If you're ready to tackle some open issues, we've collected some good first issues for you.</p></Card.Body>
            </Card>
                <div className="d-flex justify-content-between">
                    <div className="left">
                        <h5>View Issues From {props.repo.full_name}</h5>
                        <h6>{props.repo.description}</h6>
                        </div>
                        <div className="right">
                        <NewIssueButton onClick={()=>props.openIssue()} newIssue={newIssue} closeModal={props.closeModal} isOpen={props.isModalOpen}/>
                        </div>
                </div>
            {renderIssues()}
        </div>
        <div className='d-flex justify-content-center'>
        <Pagination 
                  activePage={props.page}
                  itemsCountPerPage={30}
                  totalItemsCount={props.totalCount}
                  pageRangeDisplayed={5}
                  itemClass="page-item"
                  linkClass="page-link"
                  onChange={e=>props.handlePageChange(e)}
                />
        </div>
        </div>
)
}

