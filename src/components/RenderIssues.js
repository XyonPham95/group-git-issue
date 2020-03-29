import React, {useState} from 'react'
import { Badge } from 'react-bootstrap'
import Card from 'react-bootstrap/Card';
import ReactModal from 'react-modal';
import NewIssueButton from './NewIssueButton'


export default function RenderIssues(props) {
    // const [title, setTitle] = useState('')
    // const [content, setContent] = useState('')

    const newIssue = (title, content) => {
        // setTitle(title);
        // setContent(content);
        props.postNewIssue(props.fullName,title,content)
        console.log('fullname, title, content', props.fullName, title, content)
    }

    const renderIssues = () => {
        return props.issues.map(el => <li key={el.id} onClick={()=>props.fetchSingleIssue(props.fullName, el.number)}>{el.title} 
        {el.labels.map(label => 
        <Badge key={label.id} style={{backgroundColor: `#${label.color}`}}>
             {el.labels.map(label=>label.name)}</Badge>)}
        </li>)
    }

    return (
        <div>
            
            <div className="bottom">
                <Card>
                    <Card.Header className="d-flex justify-content-between">
                        <div className="left"></div>
                        <div className="right">
                        <NewIssueButton onClick={()=>props.openIssue()} newIssue={newIssue} closeModal={props.closeModal} isOpen={props.isModalOpen}/>
                        </div>
                        </Card.Header>
                        
                    <Card.Body>
                        <Card.Text>
                        <ul> {renderIssues()}</ul>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        </div>

            
        
    )
}
