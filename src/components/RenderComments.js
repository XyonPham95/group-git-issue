import React from "react";

export default function RenderComments(props) {
  return (
    <div onClick={() => props.fetchComments(props.comments.id)}>
      {props.comments}
    </div>
  );
}
