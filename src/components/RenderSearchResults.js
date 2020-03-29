import React from 'react'

export default function RenderSearchResults(props) {
const renderSearch = () => props.reps.map(el => <li key={el.id} onClick = {() => props.fetchIssues(el.full_name)}>{el.full_name}</li>)
    return (
        <div>
            <ul>{renderSearch()}</ul>
        </div>
    )
}
