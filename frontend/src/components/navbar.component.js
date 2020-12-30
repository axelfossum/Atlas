
import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthOptions from '../components/authOptions';

export default class Navbar extends Component {

    render() {
        return (
            <nav className="navbar navbar-light navbar-expand-lg">
                <a href="/" className="navbar-brand">
                    <img src={process.env.PUBLIC_URL + '/pen-small.svg'} alt="" width="50" height="50"></img>
                </a>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mr-auto clearfix">
                        <li className="navbar-item">
                            <Link to="/" className="nav-link">Archived</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/about" className="nav-link">About Atlas</Link>
                        </li>
                    </ul>
                    <AuthOptions />
                </div>
            </nav>
        );
    }
}