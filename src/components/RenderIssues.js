import React from 'react'

export default function RenderIssues(props) {
    const renderIssues = () => {
        return props.issues.map(el => <li>{el.title}</li>)
    }
    return (
        <div>
            <ul>{renderIssues()}</ul>
        </div>
    )
}
