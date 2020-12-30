import React from 'react';
import '../styles/custom.css';

export default function ErrorNotice(props){

    return(
        <div className="alert alert-danger clearfix">
            {props.message}
            <div className="d-inline float-right">
                <button type="button" className="btn btn-link error-notice-btn p-0" onClick={props.clearError}>✗</button>
            </div>
        </div>
    );
}