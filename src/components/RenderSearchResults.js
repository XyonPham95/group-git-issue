import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Moment from 'react-moment';
import Book from './book.JPG'
import Star from './star.JPG'
import Circle from './circle.JPG'

import Pagination from "react-js-pagination";

const moment = require('moment');

export default function RenderSearchResults(props) {
    const htmlItems = props.reps.map((item, index) => {
        return (
            <div key={index} className="row border-bottom mt-3">
                <div className="col-lg-12">

                    <h4 onClick={() => props.fetchRepo(item.full_name)}><img src={Book} alt="book" />{item.full_name}</h4>
                    <div>{item.description}</div>
                    <div className="container">
                        <div className="row" style={{marginBottom: '2%'}}>
                            <div className="col-lg-2" style={{display: 'flex', alignItems: 'center', fontSize: 12}}><img src={Star} alt="star" style={{width: '20%'}}/>{item.watchers_count}</div>
                            <div className="col-lg-3" style={{display: 'flex', alignItems: 'center', fontSize: 12}}>{item.language}</div>
                            <div className="col-lg-7" style={{display: 'flex', alignItems: 'center', fontSize: 12}}>Update {moment(item.updated_at).fromNow()}</div>
                        </div>
                    </div>

                </div>

                <hr />
            </div>
        )
    })

    return (
        <div className="container">
            <div className="row">
                <div className="col-4">
                    <div style={{ border: '1px solid black', marginTop: '7%', paddingBottom: '2%', marginRight: '20%', paddingBottom: '-5%' }}>
                        <h5 style={{ borderBottom: '1px solid black', marginTop: '1%', paddingBottom: '2%', paddingTop: '2%', paddingLeft: '2%' }}>Repositories</h5>
                        <p style={{ borderBottom: '1px solid black', paddingBottom: '2%', paddingLeft: '2%' }}>Code</p>
                        <p style={{ borderBottom: '1px solid black', paddingBottom: '2%', paddingLeft: '2%' }}>Commits</p>
                        <p style={{ borderBottom: '1px solid black', paddingBottom: '2%', paddingLeft: '2%' }}>Issues</p>
                        <p style={{ borderBottom: '1px solid black', paddingBottom: '2%', paddingLeft: '2%' }}>Dicussion</p>
                        <p style={{ borderBottom: '1px solid black', paddingBottom: '2%', paddingLeft: '2%' }}>Packages</p>
                        <p style={{ borderBottom: '1px solid black', paddingBottom: '2%', paddingLeft: '2%' }}>Marketplace</p>
                        <p style={{ borderBottom: '1px solid black', paddingBottom: '2%', paddingLeft: '2%' }}>Topics</p>
                        <p style={{ borderBottom: '1px solid black', paddingBottom: '2%', paddingLeft: '2%' }}>Wikis</p>
                        <p style={{ paddingLeft: '2%', paddingTop: '-2%' }}>Users</p>
                    </div>
                </div>

                <div className="col-8" style={{ marginTop: '3%' }}>
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                        <h1 className="h2"></h1>
                        <div className="btn-toolbar mb-2 mb-md-0">
                            <button className="btn btn-sm btn-outline-secondary dropdown-toggle">
                                <span data-feather="calendar"></span>
                            Best match
                            </button>
                        </div>
                    </div>
                    {htmlItems}
                    <div className='d-flex justify-content-center'>
                        <Pagination
                            activePage={props.page}
                            itemsCountPerPage={30}
                            totalItemsCount={props.totalCount}
                            pageRangeDisplayed={5}
                            itemClass="page-item"
                            linkClass="page-link"
                            onChange={e => props.handlePageChange(e)}
                        />
                    </div>
                </div>

            </div>
        </div>
    )


}
