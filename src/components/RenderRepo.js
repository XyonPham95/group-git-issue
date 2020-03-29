import React from 'react'

export default function RenderRepo(props) {
    return (
        <div onClick={()=> props.fetchIssues(props.repo.full_name)}>
            {props.repo && props.repo.description}
        </div>
    )
}
