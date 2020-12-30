import React, { Component } from 'react';
import '../styles/custom.css';

export default class ArchivedTasksList extends Component {

    render(){
        return (
            <div className="container-fluid px-5 pt-5 text-center">
                <div className="row">
                    <div className="col-3"></div>
                    <div className="col-6">
                        <h2>Archived tasks</h2>
                    </div>
                    <div className="col-3"></div>
                </div>
                
            </div>
        );
    }

}