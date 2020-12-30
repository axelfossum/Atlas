
import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthOptions from '../components/authOptions';
import axios from 'axios';

export default class Navbar extends Component {

    constructor(props){
        super(props);

        this.state = {
            nbrArchived: 0
        }
    }

    componentDidMount(){
        axios.get('http://localhost:5000/')
            .then(response => {
                this.setState({
                    nbrArchived: response.data.filter(el => el.finished === true).length
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        return (
            <nav className="navbar navbar-light navbar-expand-lg">
                <a href="/" className="navbar-brand">
                    <img src={process.env.PUBLIC_URL + '/pen-small.svg'} alt="" width="50" height="50"></img>
                </a>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mr-auto clearfix">
                        <li className="navbar-item">
                        <Link to="/archived" className="nav-link">Archived <span className="badge badge-secondary ">{this.state.nbrArchived}</span></Link> 
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