
import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Navbar extends Component {

    render() {
        return (
            <nav className="navbar navbar-light navbar-expand-lg">
                <a href="/" className="navbar-brand">
                <img src={process.env.PUBLIC_URL + '/pen-small.svg'} alt="" width="50" height="50"></img>
                {/* <Link to="/">
                    <img src="/public/pen-small.svg" alt=""></img>
                </Link> */}
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
                    <button type="button" className="btn px-4 btn-purple">Login</button>
                    <button type="button" className="btn px-4 btn-outline-secondary ml-2">Register</button>
                </div>
            </nav>
        );
    }
}