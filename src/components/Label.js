import React from 'react'
import { Badge } from 'react-bootstrap/'

export default function Label(props) {
    return (
                props.labels.map(label =>
                <Badge className='m-1' pill style={{backgroundColor : '#'+label.color}}>
                    {props.labels.map(label=>label.name)}
                </Badge>
        ))
}
