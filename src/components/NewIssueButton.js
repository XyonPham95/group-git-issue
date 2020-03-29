import React, { useState } from "react";
import ReactModal from "react-modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function NewIssueButton(props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleTitle = event => {
    setTitle(event.target.value);
  };

  const handleContent = event => {
    setContent(event.target.value);
  };

  return (
    <div>
      <button className="btn btn-success" onClick={() => props.onClick()}>
        New Issue
      </button>
      <ReactModal
        style={modalStyle}
        isOpen={props.isOpen}
        onRequestClose={props.closeModal}
      >
        <Form>
          <Form.Group controlId="issue-title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              as="input"
              onChange={handleTitle}
              placeholder="Title"
            />
          </Form.Group>

          <Form.Group controlId="issue-body">
            <Form.Label>Write</Form.Label>
            <Form.Control
              as="textarea"
              rows="10"
              onChange={handleContent}
              placeholder="Leave a comment"
            />
          </Form.Group>
          <Button
            className="float-right"
            variant="success"
            type="submit"
            onClick={e => {
              e.preventDefault();
              props.newIssue(title, content);
            }}
          >
            Submit new issue
          </Button>
        </Form>
      </ReactModal>
    </div>
  );
}

const modalStyle = {
  content: {
    width: "50%",
    height: "70%",
    margin: "auto"
  }
};
